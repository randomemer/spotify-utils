import { fetchSession } from "~/server/utils/session";

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, "session_id");
    const env = useRuntimeConfig(event);
    return await fetchSession(env, sessionId);
  } catch (error) {
    // console.error(error);
    throw error;
  }
});
