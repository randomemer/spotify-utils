import { H3Error } from "h3";

type RequestDirection = "incoming" | "outgoing";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const direction = query.direction?.toString() || "incoming";
    const { user_id }: KVUserSession = event.context.session;

    if (!["incoming", "outgoing"].includes(direction)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameter : direction",
      });
    }

    const config = useRuntimeConfig();
    const db = await useDrizzle(config);

    const requests = await db.query.friendRequests.findMany({
      // where: (fields, { eq, or, and }) =>
      //   or(
      //     and(
      //       eq(fields.userOne, user_id),
      //       eq(fields.requestor, direction === "incoming" ? "user2" : "user1")
      //     ),
      //     and(
      //       eq(fields.userTwo, user_id),
      //       eq(fields.requestor, direction === "incoming" ? "user1" : "user2")
      //     )
      //   ),
      with: { userOneRecord: true, userTwoRecord: true },
      limit: 20,
    });

    return transformRequests(requests, direction as RequestDirection);
  } catch (error) {
    if (!(error instanceof Error)) return;
    if (error instanceof H3Error) throw error;

    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});

function transformRequests(
  requests: any[],
  direction: RequestDirection
): IncomingFriendReq[] | OutgoingFriendReq[] {
  if (direction === "incoming") {
    return requests.map((req) => ({
      id: req.id,
      createdAt: req.createdAt,
      sender: req.requestor === "user1" ? req.userOneRecord : req.userTwoRecord,
    }));
  } else {
    return requests.map((req) => ({
      id: req.id,
      createdAt: req.createdAt,
      recipient:
        req.requestor === "user2" ? req.userOneRecord : req.userTwoRecord,
    }));
  }
}
