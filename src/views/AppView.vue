<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import SideBar from "@/components/TheSideBar.vue";
import { spotify } from "@/utilities/spotify-api";
import * as ionicons from "ionicons/icons";
import { onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

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

const appNavItems = [
  {
    sectionName: "Main",
    links: [
      {
        icon: {
          outline: ionicons.gridOutline,
          filled: ionicons.grid,
        },
        name: "Dashboard",
        route: "/app/dashboard",
      },
      {
        icon: {
          outline: ionicons.personCircleOutline,
          filled: ionicons.personCircle,
        },
        name: "Account",
        route: "/app/account",
      },
    ],
  },
  {
    sectionName: "Apps",
    links: [
      {
        icon: {
          outline: ionicons.timeOutline,
          filled: ionicons.time,
        },
        name: "History",
        route: "/app/history",
      },
      {
        icon: {
          outline: ionicons.searchOutline,
          filled: ionicons.search,
        },
        name: "Recommendations",
        route: "/app/recommends",
      },
      {
        icon: {
          outline: ionicons.listOutline,
          filled: ionicons.list,
        },
        name: "Playlists",
        route: "/app/playlists",
      },
    ],
  },
];

function getHeaderTitle(): string {
  const tabs = appNavItems.flatMap((section) => section.links);
  const tab = tabs.find((tab) => useRoute().path.includes(tab.route));
  return tab!.name;
}
</script>

<template>
  <div class="app-container">
    <SideBar class="app-sidebar" :app-nav-items="appNavItems" />
    <div class="app-content">
      <TheHeader class="nav-bar" :tab-title="getHeaderTitle()" />
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
  background-color: general.$card-color;
}

.nav-bar {
  position: sticky;
  top: 0;
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
