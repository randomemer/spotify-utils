export default defineEventHandler(async (event) => {
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

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  });

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found." });
  }

  return user;
});
