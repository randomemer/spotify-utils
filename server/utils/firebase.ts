import admin from "firebase-admin";

export default function getAdmin(event: any) {
  if (admin.apps.length === 1) return admin.app();

  const env = useRuntimeConfig(event);

  return admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(env.serviceAccKey)),
  });
}
