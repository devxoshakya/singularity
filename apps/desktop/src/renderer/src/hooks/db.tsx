import { openDB } from 'idb';

async function setupDB() {
  const db = await openDB('activationDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
  return db;
}

export async function setActivationStatus(status: boolean) {
  const db = await setupDB();
  await db.put('settings', { key: 'isActivated', value: status });
}

export async function getActivationStatus(): Promise<boolean> {
  const db = await setupDB();
  const result = await db.get('settings', 'isActivated');
  return result?.value || false;
}
