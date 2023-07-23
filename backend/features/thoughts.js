const firestore = require('../utils/firestore')

// adds a thought to a device's collection (old)
const addThought = async (thoughtData) => {
  try {
    const { id, text, deviceId, timestamp } = thoughtData;
    const thoughtRef = firestore
      .collection('devices')
      .doc(deviceId)
      .collection('thoughts')
      .doc(id);
    await thoughtRef.set({
      text,
      deviceId,
      timestamp,
    });
    console.log('Thought added successfully');
  } catch (error) {
    console.error('Error adding thought:', error);
  }
};

// saves a thought to a user's collection
const saveThought = async (thoughtData, userId) => {

  // generates a UTC timestamp in the format of YYYY-MM-DDTHH:MM:SSZ
  const createdAt = new Date().toISOString();

  try {
    const { text, deviceId } = thoughtData; // thought destructure here
    const thoughtsCollectionRef = firestore
      .collection('users')
      .doc(userId)
      .collection('thoughts');
    const docRef = await thoughtsCollectionRef.add({
      text,
      deviceId,
      createdAt: createdAt,
      updatedAt: createdAt,
    });
    console.log('Thought added successfully with ID:', docRef.id);
    return {
      ...thoughtData,
      id: docRef.id,
      createdAt: createdAt,
      updatedAt: createdAt,
    };
  } catch (error) {
    console.error('Error adding thought:', error);
  }
};

// delete a thought
const deleteThought = async (thoughtId, userId) => {
  try {
    const thoughtRef = firestore
      .collection('users')
      .doc(userId)
      .collection('thoughts')
      .doc(thoughtId);
    await thoughtRef.delete();
    console.log('Thought deleted successfully');
  } catch (error) {
    console.error('Error deleting thought:', error);
  }
};

// edit a thought
const editThought = async (thoughtData, userId) => {
  
  // generates a UTC timestamp in the format of YYYY-MM-DDTHH:MM:SSZ
  const updatedAt = new Date().toISOString();

  try {
    const { id, text } = thoughtData;
    const thoughtRef = firestore
      .collection('users')
      .doc(userId)
      .collection('thoughts')
      .doc(id);
    await thoughtRef.update({
      text,
      updatedAt,
    });
    console.log('Thought edited successfully');
    // TODO: return updated thought or just timestamp?
  } catch (error) {
    console.error('Error editing thought:', error);
  }
};

const getThoughtsByDeviceId = async (deviceId) => {
  try {
    const thoughtsRef = firestore
      .collection('devices')
      .doc(deviceId)
      .collection('thoughts')
      .orderBy('timestamp', 'desc'); // Sorting by creation time
    const snapshot = await thoughtsRef.get();
    const thoughts = [];
    snapshot.forEach((doc) => {
      thoughts.push(doc.data());
    });
    return thoughts;
  } catch (error) {
    console.error('Error retrieving thoughts:', error);
  }
};

const getThoughtsByDateModified = async (userId, lastSyncTime) => {
  try {
    const thoughtsRef = firestore
      .collection('users')
      .doc(userId)
      .collection('thoughts')
      .where('updatedAt', '>', lastSyncTime)
      .orderBy('updatedAt', 'desc'); // Sorting by creation time
    const snapshot = await thoughtsRef.get();
    const thoughts = [];
    snapshot.forEach((doc) => {
      thoughts.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return thoughts;
  } catch (error) {
    console.error('Error retrieving thoughts:', error);
  }
};

module.exports = (io) => {
  console.log('thoughts.js module loaded.')

  io.on('connection', (socket) => {
    socket.on('new thought', async (thought, ack) => {
      console.log('new thought', thought);
      try {
        const thoughtData = await saveThought(thought, socket.decoded.username);
        ack({ success: true, thoughtData });
      } catch (error) {
        console.error('Error adding thought:', error);
        ack({ success: false });
      }
    });

    socket.on('delete thought', (thoughtId) => {
      console.log('delete thought', thoughtId);
      deleteThought(thoughtId, socket.decoded.username);
    });

    socket.on('edit thought', (thought) => {
      console.log('edit thought', thought);
      editThought(thought, socket.decoded.username);
    });

    socket.on('get thoughts', async (lastSyncTime, ack) => {
      console.log('get thoughts', lastSyncTime);
      try {
        const thoughts = await getThoughtsByDateModified(socket.decoded.username, lastSyncTime);

        // generates a UTC timestamp in the format of YYYY-MM-DDTHH:MM:SSZ
        const syncTime = new Date().toISOString();

        const data = {
          thoughts,
          syncTime,
        };

        ack({ success: true, data });
      } catch (error) {
        console.error('Error retrieving thoughts:', error);
        ack({ success: false });
      }
    });

  });
}
