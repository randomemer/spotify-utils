import axios from "axios";

export default defineNuxtPlugin(() => {
  const baseURL = process.dev
    ? "http://localhost:4009"
    : `https://${process.env.VERCEL_DOMAIN}`;

  return {
    provide: { api: axios.create({ baseURL, withCredentials: true }) },
  };
});
