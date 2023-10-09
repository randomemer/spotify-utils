import { defineStore } from "pinia";
import type { AxiosInstance } from "axios";

const useUserStore = defineStore("auth", {
  state: () => {
    return {
      token: null,
      spotifyProfile: null,
    } as UserState;
  },
  getters: {
    accessToken: (state) => state.token?.access_token,
    isTokenExpired: (state) =>
      !state.token?.expiry || state.token?.expiry >= Date.now(),
  },
  actions: {
    setToken(token: AuthToken) {
      this.token = token;
    },
    async fetchSpotifyProfile(spotify: AxiosInstance) {
      if (!this.token) throw new Error("No token in store");

      const resp = await spotify.get<SpotifyApi.CurrentUsersProfileResponse>(
        "/me"
      );

      this.spotifyProfile = resp.data;
      return resp.data;
    },
  },
});

export default useUserStore;
