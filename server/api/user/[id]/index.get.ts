import { eq, getTableColumns, getTableName, sql } from "drizzle-orm";
import { H3Error } from "h3";
import { users } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid User ID",
      });
    }

    console.log("getting user", id);

    const env = useRuntimeConfig();
    const db = await useDrizzle(env);

    const [user] = await db
      .select({
        ...getTableColumns(users),
        // (select count(id) from user_friends where user_id = users.id) as `friends`
        friends: sql<number>`(select count(id) from user_friends where user_id = ${users.id})`,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    // Could be undefined
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: "User not found." });
    }

    return user;
  } catch (error) {
    console.error(error);
    if (error instanceof H3Error) throw error;
    else {
      throw createError({
        statusCode: 500,
        statusMessage: "Something went wrong",
      });
    }
  }
});
