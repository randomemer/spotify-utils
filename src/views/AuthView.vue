<script lang="ts">
import { defineComponent } from "vue";
import { stringifyQuery } from "vue-router";

export default defineComponent({
  created() {
    const scopes = ["user-read-email", "user-read-private"];
    const client_id = import.meta.env.VITE_CLIENT_ID;
    const client_secret = import.meta.env.VITE_CLIENT_SECRET;

    console.log(`query :`, this.$route.query);

    if (this.$route.query.code) {
      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: this.$route.query.code.toString(),
          redirect_uri: `${location.origin}/auth`,
          grant_type: "authorization_code",
        }),
      })
        .then(async (response) => {
          const body = await response.json();
          this.$cookies.set("access_token", body.access_token);
          this.$cookies.set("refresh_token", body.refresh_token);
          this.$router.push("/app");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      window.location.href = `https://accounts.spotify.com/authorize?${stringifyQuery(
        {
          response_type: "code",
          client_id: import.meta.env.VITE_CLIENT_ID,
          scope: scopes.join(" "),
          state: this.$cookies.get("state"),
          redirect_uri: `${location.origin}/auth`,
        }
      )}`;
    }
  },
});
</script>

<template>
  <div></div>
</template>

<style scoped></style>
