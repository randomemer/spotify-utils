import { kv } from "@vercel/kv";
import { isProtectedRoute } from "~/server/utils";

const PROTECTED_ROUTES: ProtectedRoute[] = [
  "/api/recommends",
  /^\/api\/playlist(\/)?[^/]*$/,
  {
    path: /^\/api\/user(\/)?[^/]*$/,
    methods: ["PATCH"],
  },
];

export default defineEventHandler(async (event) => {
  if (!isProtectedRoute(event, PROTECTED_ROUTES)) return;

  const sessionId = getCookie(event, "session_id");
  console.log("session", sessionId);
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not logged in",
    });
  }

  const session = await kv.get<KVUserSession>(sessionId);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired session",
    });
  }

  event.context.session = session;
});
