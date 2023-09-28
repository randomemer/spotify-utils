import admin from "firebase-admin";

export default function getAdmin(serviceAccKey: string) {
  if (admin.apps.length === 1) return admin;

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccKey)),
  });

  return admin;
}

export async function createUserIfNotExists(
  serviceAccKey: string,
  profile: SpotifyApi.CurrentUsersProfileResponse
) {
  const db = getAdmin(serviceAccKey).firestore();

  await db.runTransaction(async (trx) => {
    const docRef = db.doc(`users/${profile.id}`);
    const docSnap = await trx.get(docRef);

    if (docSnap.exists && docSnap.data()) return;

    trx.create(docRef, {
      display_name: profile.display_name,
      friends: [],
    });
  });
}
