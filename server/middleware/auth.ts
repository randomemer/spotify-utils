import { extractBearerToken } from "~/utils/helpers";

const PROTECTED_ROUTES: ProtectedRoute[] = [
  "/api/recommends",
  /^\/api\/playlist(\/)?[^/]*$/,
];

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Check if it is protected
  const isProtected = PROTECTED_ROUTES.some((route) => {
    // String
    if (typeof route === "string") {
      return route === url.pathname;
    }
    // Regex
    else if (route instanceof RegExp) {
      return route.test(url.pathname);
    }
    // Object config
    else {
      if (url.pathname !== route.path) return false;
      if (!route.methods?.includes(event.method)) {
        return false;
      }
    }
  });

  if (!isProtected) return;

  // Check for bearer token
  const token = extractBearerToken(event.headers.get("Authorization"));
  if (!token) {
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid or absent token",
      });
    }
  }

  event.context.token = token;
});
