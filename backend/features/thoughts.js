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
  try {
    const { id, text, deviceId, timestamp } = thoughtData;
    const thoughtRef = firestore
      .collection('users')
      .doc(userId)
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
  try {
    const { id, text } = thoughtData;
    const thoughtRef = firestore
      .collection('users')
      .doc(userId)
      .collection('thoughts')
      .doc(id);
    await thoughtRef.update({
      text,
    });
    console.log('Thought edited successfully');
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

module.exports = (io) => {
  console.log('thoughts.js module loaded.')

  io.on('connection', (socket) => {
    socket.on('new thought', (thought) => {
      console.log('new thought', thought);
      // addThought(thought);
      saveThought(thought, socket.decoded.username);
    });

    socket.on('delete thought', (thoughtId) => {
      console.log('delete thought', thoughtId);
      deleteThought(thoughtId, socket.decoded.username);
    });

    socket.on('edit thought', (thought) => {
      console.log('edit thought', thought);
      editThought(thought, socket.decoded.username);
    });

  });
}
