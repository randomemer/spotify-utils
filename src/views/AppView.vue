<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data(): any {
    return {
      user: null,
    };
  },
  created() {
    // Get a new access token
    console.log(this.$cookies.get("refresh_token"));

    // Fetch User deatils
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${this.$cookies.get("access_token")}` },
    }).then(async (response) => {
      const body = await response.json();
      console.log(body);
      this.$data.user = body;
    });
  },
});
</script>

<template>
  <div class="container">
    <div class="hello-el">
      <img :src="user?.images[0].url" class="pfp" />
      <h3>Hello there, {{ user?.display_name }}</h3>
    </div>
  </div>
</template>

<style scoped>
.hello-el {
  display: flex;
  align-items: center;
  gap: 5rem;
}

.pfp {
  border-radius: 50rem;
  height: 15rem;
  width: 15rem;
}
</style>
