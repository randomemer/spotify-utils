<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import type { PropType } from "vue";
import { useRouter } from "vue-router";
const $router = useRouter();

defineProps({
  appNavItems: {
    required: true,
    type: Object as PropType<{ sectionName: string; links: AppTab[] }[]>,
  },
});

function isActiveLink(route: string): boolean {
  return $router.currentRoute.value.path.includes(route);
}
</script>

<template>
  <aside class="sidebar">
    <span class="logo-title">Spotify Utilities</span>

    <nav class="nav-links-area">
      <div class="link-section" v-for="(section, _, i) in appNavItems" :key="i">
        <span class="link-section-name">{{ section.sectionName }}</span>
        <ul class="nav-links">
          <li v-for="(value, _, i) in section.links" :key="i">
            <router-link
              class="nav-link"
              :to="value.route"
              :class="{
                'nav-link--active': isActiveLink(value.route),
              }"
            >
              <ion-icon
                class="route-icon"
                :icon="
                  isActiveLink(value.route)
                    ? value.icon.filled
                    : value.icon.outline
                "
              />
              <span>{{ value.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.logo-title {
  font-size: 3rem;
  text-align: center;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;

  padding: 2.4rem;
  background-color: general.$card-color;

  display: flex;
  gap: 4.8rem;
  flex-direction: column;

  * {
    transition: all 0.1s;
  }
}

.nav-links-area {
  display: flex;
  align-self: stretch;
  flex-direction: column;
  gap: 3rem;
}

.link-section {
  display: flex;
  flex-direction: column;
}

.link-section-name {
  text-transform: uppercase;
  font-size: 1.4rem;
  color: #bbb;
  margin-bottom: 1.8rem;
}

.nav-links {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 1.6rem;
  margin-left: 1.6rem;
}

.nav-link {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.6rem;
  color: white;

  display: flex;
  align-items: center;
  gap: 1.5rem;

  &--active {
    color: general.$primary-font-color;
  }
}

.route-icon {
  font-size: 2.2rem;
}
</style>
