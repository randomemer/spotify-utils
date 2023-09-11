export default defineAppConfig({
  scopes: [
    // user
    "user-read-email",
    // playlist
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-private",
    "playlist-modify-public",
    // connect
    "user-read-currently-playing",
    // listening history
    "user-top-read",
    "user-read-recently-played",
  ],
});
