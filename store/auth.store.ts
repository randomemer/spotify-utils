import { defineStore } from "pinia";

const useAuthStore = defineStore("auth", {
  state: () =>
    ({
      token: null,
    } as AuthState),
  getters: {
    accessToken: (state) => state.token?.access_token,
    isTokenExpired: (state) =>
      !state.token?.expiry || state.token?.expiry >= Date.now(),
  },
  actions: {
    setToken(token: AuthToken) {
      this.token = token;
    },
  },
});

export default useAuthStore;
