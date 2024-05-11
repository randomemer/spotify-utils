import { eq } from "drizzle-orm";
import { H3Error } from "h3";
import { v4 as uuidv4 } from "uuid";
import { friendRequests, userFriends } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const db = await useDrizzle(config);

    const requestId = event.context.params?.id;
    if (!requestId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Friend request ID was provided",
      });
    }

    // 1. Get the request
    const request = await db.query.friendRequests.findFirst({
      where: (fields, { eq }) => eq(fields.id, requestId),
    });
    if (!request) {
      throw createError({
        statusCode: 404,
        statusMessage: "Friend request not found",
      });
    }

    // 2. Peform transaction
    await db.transaction(async (trx) => {
      const { userOne, userTwo } = request;
      await trx.insert(userFriends).values([
        { id: uuidv4(), userId: userOne, friendId: userTwo },
        { id: uuidv4(), userId: userTwo, friendId: userOne },
      ]);
      await trx.delete(friendRequests).where(eq(friendRequests.id, requestId));
    });
  } catch (error) {
    if (!(error instanceof Error)) return;
    if (error instanceof H3Error) throw error;

    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
