import { openDB } from 'idb';

const DB_NAME = 'persistPadDB';
const STORE_NAME = 'Notes';

const initdb = async () => {
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        console.log(`${STORE_NAME} database created`);
      } else {
        console.log(`${STORE_NAME} database already exists`);
      }
    },
  });
};

export const postDb = async (title, content, tags = []) => {
  try {
    const timestamp = new Date().toISOString();
    const db = await openDB(DB_NAME, 1);
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const result = await store.add({ title, content, timestamp, tags });
    console.log('Note saved to the database', result);
  } catch (err) {
    console.error("Error posting note to the database:", err);
  }
};

export const getDb = async () => {
    try {
        const db = await openDB(DB_NAME, 1);
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const result = await store.getAll();
        console.log('Notes retrieved from the database', result);
        return result;
    } catch (err) {
        console.error("Error getting notes from the database:", err);
    }
};

export const deleteDb = async (id) => {
    try {
        const db = await openDB(DB_NAME, 1);
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const result = await store.delete(id);
        console.log('Note deleted from the database', result);
    } catch (err) {
        console.error("Error deleting note from the database:", err);
    }
};

export const updateDb = async (id, title, content, tags = []) => {
    try {
        const timestamp = new Date().toISOString();
        const db = await openDB(DB_NAME, 1);
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const result = await store.put({ id, title, content, timestamp, tags });
        console.log('Note updated in the database', result);
    } catch (err) {
        console.error("Error updating note in the database:", err);
    }
};


initdb();
