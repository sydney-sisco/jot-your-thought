import Dexie from 'dexie';
export const db = new Dexie("ThoughtsDB");

db.version(1).stores({
  thoughts: 'id&, text, deviceId, createdAt, updatedAt'
});
