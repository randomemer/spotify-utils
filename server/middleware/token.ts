import { extractBearerToken } from "~/utils/helpers";
import { isProtectedRoute } from "~/server/utils";

const PROTECTED_ROUTES: ProtectedRoute[] = [
  "/api/recommends",
  /^\/api\/playlist(\/)?[^/]*$/,
];

export default defineEventHandler(async (event) => {
  if (!isProtectedRoute(event, PROTECTED_ROUTES)) return;

  const token = extractBearerToken(event.headers.get("Authorization"));
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or absent token",
    });
  }

  event.context.token = token;
});
