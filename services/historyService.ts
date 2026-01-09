
import { HistoryItem } from '../types';

const DB_NAME = 'SentientStudioDB';
const STORE_NAME = 'history';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveHistoryItem = async (item: HistoryItem): Promise<void> => {
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.add(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
  } catch (e) {
      console.error("Failed to save to history DB", e);
  }
};

export const getAllHistory = async (): Promise<HistoryItem[]> => {
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
            const items = request.result as HistoryItem[];
            // Sort by timestamp descending (newest first)
            items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            resolve(items);
        };
        request.onerror = () => reject(request.error);
      });
  } catch (e) {
      console.error("Failed to load history DB", e);
      return [];
  }
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
  } catch (e) {
      console.error("Failed to delete from history DB", e);
  }
};
