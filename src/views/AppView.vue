<script lang="ts">
import app from "@/main";
import { defineComponent } from "vue";
import NavBar from "@/components/NavBar.vue";
import type { AccountCookie } from "@/types/types";

const client_id = import.meta.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET;

export default defineComponent({
  methods: {
    async getNewAccessToken() {
      try {
        const account: AccountCookie = this.$cookies.get("current_user");
        console.log(account);
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: account.refresh_token,
          }),
        });

        const body = await response.json();
        this.$cookies.set("access_token", body.access_token);
        app.config.globalProperties.access_token = body.access_token;
      } catch (error) {
        console.warn(error);
      }
    },
  },
  created() {
    this.getNewAccessToken();
  },
  components: {
    NavBar,
  },
});
</script>

<template>
  <div class="app-container">
    <NavBar />
    <RouterView class="app-main" />
  </div>
</template>

<style scoped>
.app-container {
  position: fixed;
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-columns: 15fr 85fr;
  align-items: stretch;
}

.app-main {
  padding: 6.4rem;
  overflow-y: scroll;
  flex: 1;
  scrollbar-color: rgb(123, 123, 123) rgb(66, 66, 66);
}
</style>
