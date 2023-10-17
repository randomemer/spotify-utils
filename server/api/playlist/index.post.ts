export default defineEventHandler(async (event) => {
  try {
    const token: string = event.context.token;
  } catch (error) {
    console.error(error);
    throw createError({ statusMessage: "Something went wrong" });
  }
});
