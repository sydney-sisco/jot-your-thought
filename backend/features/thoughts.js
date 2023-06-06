const firestore = require('../utils/firestore')

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
      addThought(thought);
    });
  });
}
