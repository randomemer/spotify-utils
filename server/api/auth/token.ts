import { fetchSession } from "~/server/utils/session";

export default defineEventHandler(async (event) => {
  try {
    return await fetchSession(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
});
