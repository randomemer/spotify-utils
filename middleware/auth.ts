import { AxiosError } from "axios";
import useAuthStore from "~/store/auth.store";

export default defineNuxtRouteMiddleware(async () => {
  const { $api, $pinia } = useNuxtApp();
  const authStore = useAuthStore($pinia);

  const { token } = authStore;
  // 1. Check token in the store
  if (!token || token.expiry >= Date.now()) {
    try {
      const resp = await $api.get("/api/auth/token");
      console.log("", resp.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status && [400, 401, 403].includes(status)) {
          // await ctx?.$router.replace("/auth/login");
          return { path: "/auth/login", replace: true };
        }
      }
    }
  }
});
