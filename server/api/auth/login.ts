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
        redirect_uri: `${env.public.webOrigin}/auth/callback`,
      });
      return {
        status: "redirect",
        url: `https://accounts.spotify.com/authorize?${query}`,
      };
    }

    const tokenData = await fetchSession(env, sessionId);
    return {
      status: "success",
      payload: tokenData,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
});
