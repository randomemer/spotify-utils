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
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    // listening history
    "user-read-playback-position",
    "user-top-read",
    "user-read-recently-played",
  ],
});
