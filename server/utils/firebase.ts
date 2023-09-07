import admin from "firebase-admin";

export default function getAdmin(serviceAccKey: string) {
  if (admin.apps.length === 1) return admin;

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccKey)),
  });

  return admin;
}
