import { AxiosError } from "axios";
import useUserStore from "~/store/user.store";
import { H3Error, getCookie } from "h3";

export default defineNuxtRouteMiddleware(async () => {
  const { $api, $pinia, $config } = useNuxtApp();
  const authStore = useUserStore($pinia);

  const { token } = authStore;
  if (!token || token.expiry <= Date.now()) {
    // Server Runtime
    if (process.server) {
      console.time("fetch_session_server");
      try {
        const event = useRequestEvent();
        const cookie = getCookie(event, "session_id");

        const { fetchSession } = await import("~/server/utils/session");
        const tokenData = await fetchSession($config as any, cookie!);
        authStore.setToken(tokenData);
      } catch (error) {
        if (error instanceof H3Error && error.statusCode === 401) {
          return { path: "/auth/login", replace: true };
        }
        console.error(error);
      }
      console.timeEnd("fetch_session_server");
    }

    // Browser / Client runtime
    if (process.client) {
      console.time("fetch_session_client");
      try {
        const resp = await $api.get<AuthToken>("/auth/token");
        authStore.setToken(resp.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status && [400, 401, 403].includes(status)) {
            return { path: "/auth/login", replace: true };
          }
        }
        console.error(error);
      }
      console.timeEnd("fetch_session_client");
    }
  }
});
