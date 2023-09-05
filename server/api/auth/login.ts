export default defineEventHandler(async (event) => {
  try {
    const env = useRuntimeConfig(event);
    const appConfig = useAppConfig(event);
    const sessionId = getCookie(event, "session_id");

    if (!sessionId) {
      // Redirect to the spotify auth page
      const query = new URLSearchParams({
        response_type: "code",
        client_id: env.spotifyClientId,
        scope: appConfig.scopes.join(" "),
        redirect_uri: `http://localhost:4009/api/auth/callback`,
      });
      return sendRedirect(
        event,
        `https://accounts.spotify.com/authorize?${query}`
      );
    }

    return sendRedirect(event, "/app");
  } catch (error) {
    console.error(error);
    throw error;
  }
});
