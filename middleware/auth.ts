export default defineNuxtRouteMiddleware(() => {
  const sessionId = useCookie("token");

  if (!sessionId.value) {
    return {
      path: "/auth/login",
      replace: true,
    };
  } else return undefined;
});
