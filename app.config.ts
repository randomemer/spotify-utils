export default defineAppConfig({
  audioFeatures: [
    "acousticness",
    "danceability",
    "valence",
    "instrumentalness",
    "energy",
    "speechiness",
  ],
  scopes: [
    // cover images
    "ugc-image-upload",
    // playlist
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-private",
    "playlist-modify-public",
    // listening history
    "user-top-read",
  ],
});
