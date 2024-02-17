import { H3Event, type EventHandlerRequest } from "h3";

export function comparePathLike(pathname: string, pathLike: PathLike) {
  if (typeof pathLike === "string") return pathLike === pathname;
  else return pathLike.test(pathname);
}

export function isProtectedRoute(
  event: H3Event<EventHandlerRequest>,
  routes: ProtectedRoute[]
) {
  const url = getRequestURL(event);

  return routes.some((route) => {
    // Object config
    if (typeof route === "object" && !(route instanceof RegExp)) {
      return (
        comparePathLike(url.pathname, route.path) &&
        route.methods?.includes(event.method)
      );
    }
    // String or Regex
    else return comparePathLike(url.pathname, route);
  });
}
