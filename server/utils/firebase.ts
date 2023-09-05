import admin from "firebase-admin";
import type { H3Event } from "h3";

export default function getAdmin(event: H3Event) {
  if (admin.apps.length === 1) return admin;

  const env = useRuntimeConfig(event);
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(env.serviceAccKey)),
  });

  return admin;
}
