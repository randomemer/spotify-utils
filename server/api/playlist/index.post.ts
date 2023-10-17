import axios from "axios";
import sharp from "sharp";

export default defineEventHandler(async (event) => {
  try {
    const token: string = event.context.token;

    const $spotify = axios.create({
      baseURL: "https://api.spotify.com/v1",
      headers: { Authorization: `Bearer ${token}` },
    });

    const form = await readFormData(event);
    const input = parsePlaylistInput(form);
    console.log(input);

    // 1. Create playlist
    const { data: playlist } =
      await $spotify.post<SpotifyApi.CreatePlaylistResponse>(
        `/users/${input.user_id}/playlists`,
        {
          name: input.name,
          public: input.public,
          description: input.description,
        }
      );

    // 2. Upload cover image (if provided)
    if (input.image) {
      const base64Str = await getPlaylistImage(input.image);
      await $spotify.put(`/playlists/${playlist.id}/images`, base64Str);
    }

    // 3. Add tracks
    await $spotify.post(`playlists/${playlist.id}/tracks`, input.tracks);
    return playlist;
  } catch (error) {
    console.error(error);
    throw createError({ statusMessage: "Something went wrong" });
  }
});

function parsePlaylistInput(formData: FormData): CreatePlaylistForm {
  return {
    name: formData.get("name"),
    user_id: formData.get("user_id"),
    tracks: formData.getAll("tracks[]"),
    description: formData.get("description"),
    image: formData.get("image"),
    public: formData.get("public"),
  } as CreatePlaylistForm;
}

async function getPlaylistImage(file: File): Promise<string> {
  const arrBuf = await file.arrayBuffer();
  let image = sharp(arrBuf);

  if (file.size > 256_000) {
    image = image.jpeg({ quality: 50 });
  }

  const buf = await image.toBuffer();
  return buf.toString("base64");
}
