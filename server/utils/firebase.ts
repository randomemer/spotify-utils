import admin from "firebase-admin";

export default function getAdmin(serviceAccKey: string) {
  if (admin.apps.length === 1) return admin;

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccKey)),
  });

  return admin;
}

export async function createUser(
  serviceAccKey: string,
  profile: SpotifyApi.CurrentUsersProfileResponse
) {
  const db = getAdmin(serviceAccKey).firestore();

  try {
    const docRef = db.doc(`users/${profile.id}`);
    const docData: Omit<UserDocument, "id"> = {
      username: profile.id,
      display_name: profile.display_name ?? "",
      friends: [],
      created_at: Date.now(),
      picture: profile.images?.at(-1)?.url ?? null,
    };

    await docRef.create(docData);
  } catch (error) {
    if (!(error instanceof Error)) return;
    // Firebase does not provide an instance class to check the
    // error's instance type, hence using this hack instead
    if (error.message.includes("ALREADY_EXISTS")) return;
    throw error;
  }
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

export function combineDataAndId<T>(doc: admin.firestore.DocumentSnapshot) {
  return { id: doc.id, ...doc.data() } as T;
}
