<script setup lang="ts">
import NavBar from "@/components/TheNavBar.vue";
import SideBar from "@/components/TheSideBar.vue";
import { spotify } from "@/utilities/spotify-api";
import { onUnmounted } from "vue";
import { useRouter } from "vue-router";

const client_id = import.meta.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET;

async function refreshAccessToken(): Promise<
  RefreshedAccessTokenResponse | undefined
> {
  const accountJSON = localStorage.getItem("current_user");

  if (accountJSON === null) {
    console.log("no user logged in. redirecting to auth...");
    await useRouter().push("/auth");
    return;
  }

  const account: Account = JSON.parse(accountJSON);

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

  const body: RefreshedAccessTokenResponse = await response.json();
  spotify.setAccessToken(body.access_token);
  return body;
}

const interval = setInterval(refreshAccessToken, 3600);

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="app-container">
    <SideBar class="app-sidebar" />
    <div class="app-content">
      <NavBar class="nav-bar" />
      <RouterView class="app-main" />
    </div>
  </div>
</template>

<style lang="scss">
$sidebar-width: 27rem;

.app-container {
  min-height: 100vh;
}

.app-sidebar {
  width: $sidebar-width;
}

.nav-bar {
  margin-bottom: 3.2rem;
  position: sticky;
  top: 0;
  /* box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.36); */
  padding: 1.6rem 6.4rem;
}

.app-content {
  padding-left: $sidebar-width;
  scrollbar-color: rgb(123, 123, 123) rgb(66, 66, 66);
}

.app-main {
  margin: 6.4rem;
  margin-top: 0px;
}
</style>
