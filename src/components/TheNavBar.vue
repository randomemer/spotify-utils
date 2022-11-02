<script lang="ts">
import { IonIcon } from "@ionic/vue";
import {
  logOutOutline,
  notifications,
  notificationsOutline,
  personCircle,
} from "ionicons/icons";
import { defineComponent } from "vue";
import PopupMenu from "@/components/PopupMenu.vue";
import ProfileCard from "@/components/profile-card/ProfileCard.vue";

export default defineComponent({
  components: { IonIcon, PopupMenu, ProfileCard },
  setup() {
    return { notificationsOutline, notifications, logOutOutline, personCircle };
  },
  data() {
    return {
      notifsPopperActive: false,
      profilePopperActive: false,
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
    toggleProfilePopper(state: boolean) {
      this.profilePopperActive = state;
    },
    toggleNotifsPopper(state: boolean) {
      this.notifsPopperActive = state;
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
          :class="{ 'notifs-button-active': notifsPopperActive }"
          @click="toggleNotifsPopper(!notifsPopperActive)"
        >
          <IonIcon
            :icon="notifsPopperActive ? notifications : notificationsOutline"
          />
        </button>
        <popup-menu
          class="notifs-popup"
          reference-el-selector=".notifs-button"
          :is-open="notifsPopperActive"
          :popper-options="{
            placement: 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                phase: 'main',
                enabled: true,
                options: { offset: [0, 20] },
              },
            ],
          }"
        >
          <div>No Notifications Rn</div>
        </popup-menu>
      </li>
      <li>
        <button
          class="profile-button btn"
          @click="toggleProfilePopper(!profilePopperActive)"
        >
          <img :src="pfpUrl" />
        </button>
        <popup-menu
          class="profile-popup"
          reference-el-selector=".profile-button"
          :is-open="profilePopperActive"
          @toggled="toggleProfilePopper($event)"
          :popper-options="{
            placement: 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                phase: 'main',
                enabled: true,
                options: { offset: [0, 20] },
              },
            ],
          }"
        >
          <ProfileCard :user="getAccount().user" />
          <hr class="" />
          <ul class="list">
            <li>
              <RouterLink to="/account" class="account-option link">
                <IonIcon :icon="personCircle" />
                <span>Account</span>
              </RouterLink>
              <RouterLink to="/logout" class="account-option link">
                <IonIcon :icon="logOutOutline" />
                <span>Logout</span>
              </RouterLink>
            </li>
          </ul>
        </popup-menu>
      </li>
    </ul>
  </header>
</template>

<style scoped lang="scss">
.header {
  background-color: general.$background-color;
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

.notifs-button {
  ion-icon {
    font-size: 3rem;
  }
}

.notifs-button-active {
  color: general.$primary-color;
}

.profile-button {
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
}

.profile-popup {
  display: flex;
  flex-direction: column;
  background-color: general.$card-color;
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.36);
  border-radius: 10px;
  z-index: 100;

  .list {
    padding: 10px 0;
  }
}

.separator {
  margin: 10px 0;
}

.account-option {
  font-size: 1.6rem;
  display: flex;
  gap: 1.8rem;
  align-self: stretch;
  align-items: center;
  padding: 0.9rem 1.8rem;

  ion-icon {
    font-size: 2.2rem;
  }

  &:hover {
    background-color: general.$primary-color;
  }
}
</style>
