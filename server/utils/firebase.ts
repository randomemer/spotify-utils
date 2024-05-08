import admin from "firebase-admin";

export default function getAdmin(serviceAccKey: string) {
  if (admin.apps.length === 1) return admin;

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccKey)),
  });

  return admin;
}

export async function uploadObject(
  path: string,
  data: string | Buffer,
  serviceAccKey: string,
  bucketName: string
): Promise<string> {
  const bucket = getAdmin(serviceAccKey).storage().bucket(bucketName);

  const file = bucket.file(path);
  await file.save(data);

  return `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(path)}?alt=media`;
}
