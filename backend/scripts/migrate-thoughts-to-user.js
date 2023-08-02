// Migration script to migrate thoughts from a device to a user.
// probably won't work again if anything about the data structure changes.

const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
  projectId: 'webapp-template-388404',
});

const migrateThoughts = async (deviceId, userId) => {
  let deviceRef = firestore.doc(`devices/${deviceId}`);
  let deviceSnapshot = await deviceRef.get();

  if (deviceSnapshot.exists && deviceSnapshot.data().synced === true) {
    console.log(`Device ${deviceId} is already synced.`);
    return; // Exit the function as device is already synced.
  }

  let thoughtsRef = firestore.collection(`devices/${deviceId}/thoughts`);
  let usersRef = firestore.collection(`users/${userId}/thoughts`);

  const thoughtsSnapshot = await thoughtsRef.get();

  for (let doc of thoughtsSnapshot.docs) {
    const data = doc.data();
    const { text, deviceId, timestamp } = data;
    const createdAt = timestamp;

    await usersRef.add({
      text,
      deviceId,
      createdAt,
      updatedAt: createdAt
    });
  }

  await deviceRef.set({
    synced: true
  }, { merge: true });
}

// migrateThoughts('device-70bcc9b3-3bbc-41c2-96e0-f86d82da94b0', 'sydney');
