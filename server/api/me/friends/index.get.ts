import { eq } from "drizzle-orm";
import { userFriends, users } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const { user_id }: KVUserSession = event.context.session;
  const env = useRuntimeConfig();
  const db = await useDrizzle(env);

  // const result = await db.query.users.findFirst({
  //   where: (fields, { eq }) => eq(fields.id, user_id),
  //   with: {
  //     friends: {
  //       limit: 20,
  //       with: {
  //         friend: true,
  //       },
  //     },
  //   },
  // });

  const result = await db
    .select()
    .from(userFriends)
    .leftJoin(users, eq(userFriends.friendId, users.id))
    .where(eq(userFriends.id, user_id));

  if (!result) {
    throw createError({ statusCode: 404, statusMessage: "User not found!" });
  }

  console.log("got friends", result);

  // const friends = result.friends.map((friendship) => friendship.friend);
  return result;
});
