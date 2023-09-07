import axios from "axios";

const apiPath = process.dev
  ? "http://localhost:4009"
  : `https://${process.env.VERCEL_DOMAIN}`;

export const api = axios.create({ baseURL: apiPath, withCredentials: true });
