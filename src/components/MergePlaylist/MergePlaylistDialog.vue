<script lang="ts">
import { defineComponent } from "vue";
import ListItem from "./ListItem.vue";
import { IonIcon } from "@ionic/vue";
import { addOutline, closeOutline } from "ionicons/icons";

export default defineComponent({
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      isModalOpen: false,
      playlists: new Array<string>(),
      playlistName: "",
      playlistUrl: "",
    };
  },
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
      // reset state
      this.playlists = [];
      this.playlistUrl = "";
      this.playlistName = "";
    },
    async getPlaylistTracks(playlist: any): Promise<string[] | undefined> {
      try {
        const t = true;
        const tracks: any[] = [];
        let body = playlist.tracks;

        while (t) {
          const URIs = body.items.map((item: any) => item.track.uri);
          tracks.push(...URIs);

          if (!body.next) break;

          const response = await fetch(body.next, {
            headers: {
              Authorization: `Bearer ${this.$cookies.get("access_token")}`,
              "Content-Type": "application/json",
            },
          });

          body = await response.json();
        }

        return tracks;
      } catch (error) {
        console.error(error);
      }
    },
    async createNewPlaylist() {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/users/${this.id}/playlists`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.$cookies.get("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: this.playlistName,
              public: false,
            }),
          }
        );

        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    addNewPlaylist() {
      this.playlists.push(this.playlistUrl);
      this.playlistUrl = "";
    },
    async mergePlaylist() {
      try {
        // Create a playlist
        const newPlaylist = await this.createNewPlaylist();
        console.log(newPlaylist);

        // Collect IDs of all tracks
        const items: typeof ListItem[] = this.$refs.listItems as any;
        const tracks = new Set<string>();

        for (const { $data } of items) {
          const URIs = await this.getPlaylistTracks($data.playlist);
          URIs?.forEach((uri) => tracks.add(uri));
        }

        // Add 100 tracks in each request
        const arr = Array.from(tracks);
        for (let i = 0; i < Math.ceil(arr.length / 100); i++) {
          const response = await fetch(
            `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.$cookies.get("access_token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                uris: arr.slice(100 * i, 100 * (i + 1)),
              }),
            }
          );
          console.log(response);
        }

        console.log(newPlaylist.external_urls.spotify);
      } catch (error) {
        console.error(error);
      }
    },
  },
  components: { ListItem, IonIcon },
  setup() {
    return { addOutline, closeOutline };
  },
});
</script>

<template>
  <div class="modal" :class="{ 'show-modal': isModalOpen }">
    <div class="modal-content">
      <span class="close-button" v-on:click="toggleModal"
        ><ion-icon :icon="closeOutline"></ion-icon
      ></span>

      <form @submit.prevent="mergePlaylist">
        <h3 class="heading-tertiary">Merge Playlists</h3>

        <input
          required
          type="text"
          name="playlist-name"
          v-model="playlistName"
          placeholder="Enter New Playlist Name"
          class="input-playlist-name"
        />

        <div class="editable-list" ref="list">
          <ListItem
            v-for="(url, index) in playlists"
            :key="url"
            :playlist-url="url"
            ref="listItems"
            :delete-callback="() => playlists.splice(index, 1)"
          />
        </div>

        <div class="add-item-menu">
          <input
            type="url"
            v-model="playlistUrl"
            name="playlist-url"
            placeholder="Enter Playlist Link"
            class="add-item-input"
          />
          <button
            type="button"
            class="add-item-button"
            v-on:click="addNewPlaylist"
          >
            <ion-icon :icon="addOutline"></ion-icon>
          </button>
        </div>

        <button type="submit" class="merge-submit-button">MERGE</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: all 0.3;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #191414;
  padding: 2.4rem;
  width: 50rem;
  height: 50rem;
  border-radius: 0.5rem;
}

.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}

.close-button {
  float: right;
  font-size: 2.4rem;
  padding: 0.5rem;
  border-radius: 3rem;
  display: flex;
  align-items: center;
  /* background-color: lightgray; */
  transition: all 0.3s;
}

.close-button:hover {
  background-color: rgba(169, 169, 169, 0.5);
}

form {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 2.4rem;
}

.input-playlist-name {
  padding: 0.8rem 1.2rem;
  color: black;
}

.editable-list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: scroll;
  border-style: solid;
  border-color: white;
  border-width: 2px 0;
}

.editable-list div {
  padding: 1.2rem;
}

.add-item-menu {
  display: flex;
  gap: 1.2rem;
}

.add-item-input {
  flex-grow: 1;
  padding: 0.8rem 1.2rem;
  color: black;
}

.add-item-button {
  background-color: #1db954;
  font-size: 2.4rem;
  padding: 0.5rem;
  border-radius: 3rem;
  display: flex;
  align-items: center;
}

.merge-submit-button {
  align-self: flex-end;
  background-color: #1db954;
  border-radius: 2.5rem;
  padding: 1.2rem;
}
</style>
