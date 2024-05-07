export default defineEventHandler(async (event) => {
  const { user_id }: KVUserSession = event.context.session;
  const env = useRuntimeConfig();
  const db = await useDrizzle(env);

  const result = await db.query.users.findFirst({
    where: (fields, { eq }) => eq(fields.id, user_id),
    with: {
      friends: {
        limit: 20,
        with: {
          friend: true,
        },
      },
    },
  });

  if (!result) {
    throw createError({ statusCode: 404, statusMessage: "User not found!" });
  }

  const friends = result.friends.map((friendship) => friendship.friend);
  return friends;
});
