<script lang="ts">
import { IonIcon } from "@ionic/vue";
import {
  logOutOutline,
  notifications,
  notificationsOutline,
} from "ionicons/icons";
import { defineComponent } from "vue";
import PopupMenu from "./PopupMenu.vue";
import ProfileCard from "./profile-card/ProfileCard.vue";
import { createPopper } from "@popperjs/core";

export default defineComponent({
  components: { IonIcon, PopupMenu, ProfileCard },
  setup() {
    return { notificationsOutline, notifications, logOutOutline };
  },
  mounted() {
    const profileBtn = document.querySelector<HTMLElement>(".profile-button");
    const profilePopup = document.querySelector<HTMLElement>(".profile-popup");

    createPopper(profileBtn!, profilePopup!, {
      placement: "bottom-end",
      modifiers: [
        { name: "offset", enabled: true, phase: "main", data: { y: 15 } },
      ],
    });

    console.log(profileBtn);
    console.log(profilePopup);
  },
  data() {
    return {
      notifsButtonActive: false,
      profileButtonActive: false,
    };
  },
  computed: {
    pfpUrl(): string {
      const account = this.getAccount();

      const profileImages = account.user.images;
      if (profileImages) {
        return profileImages[profileImages.length - 1].url;
      } else {
        return "";
      }
    },
  },
  methods: {
    getAccount(): Account {
      const accountJSON = localStorage.getItem("current_user") as string;
      return JSON.parse(accountJSON);
    },
  },
});
</script>

<template>
  <header class="header">
    <ul class="header-list-items list">
      <li>
        <button
          class="notifs-button btn"
          :class="{ 'notifs-button-active': notifsButtonActive }"
          @click="notifsButtonActive = !notifsButtonActive"
        >
          <IonIcon
            class="notifs-icon"
            :icon="notifsButtonActive ? notifications : notificationsOutline"
          />
        </button>
      </li>
      <li>
        <button
          class="profile-button btn"
          @click="profileButtonActive = !profileButtonActive"
        >
          <img class="profile-image-small" :src="pfpUrl" />
        </button>
        <popup-menu :prop-is-open="profileButtonActive" class="profile-popup">
          <ProfileCard :user="getAccount().user" />
          <hr class="" />
          <ul class="account-links list">
            <li>
              <div class="account-option">
                <IonIcon :icon="logOutOutline" class="option-icon" />
                <span>Logout</span>
              </div>
            </li>
          </ul>
        </popup-menu>
      </li>
    </ul>
  </header>
</template>

<style scoped lang="scss">
.header {
  background-color: $background-color;
}

.account-links {
  padding: 10px 0;
}

.header-list-items {
  display: flex;
  justify-content: flex-end;
  gap: 3rem;
}

.btn {
  height: 3.6rem;
  width: 3.6rem;
  color: white;
  border-radius: 5.6rem;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.notifs-icon {
  font-size: 3rem;
}

.notifs-button-active {
  color: $primary-color;
}

.profile-button {
  overflow: hidden;
}

.profile-image-small {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.profile-popup {
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: $card-color;
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.36);
  border-radius: 10px;
}

.separator {
  margin: 10px 0;
}

.account-option {
  font-size: 1.8rem;
  display: flex;
  gap: 1.8rem;
  align-self: stretch;
  padding: 0.9rem 1.8rem;
}

.option-icon {
  font-size: 2.2rem;
}
</style>
