import { DBSchema, openDB, IDBPDatabase } from 'idb';
import { User, ChangeRequest } from './types';
import { MOCK_USERS } from './constants';

const DB_NAME = 'ITChangeRequestDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';
const REQUESTS_STORE = 'changeRequests';

interface ITChangeRequestDB extends DBSchema {
  [USERS_STORE]: {
    key: string;
    value: User;
    indexes: { 'by-id': string };
  };
  [REQUESTS_STORE]: {
    key: string;
    value: ChangeRequest;
    indexes: { 'by-requester': string; 'by-status': string };
  };
}

let dbPromise: Promise<IDBPDatabase<ITChangeRequestDB>> | null = null;

const getDb = (): Promise<IDBPDatabase<ITChangeRequestDB>> => {
    if (!dbPromise) {
        dbPromise = openDB<ITChangeRequestDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                if (oldVersion < 1) {
                    const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' });
                    userStore.createIndex('by-id', 'id', { unique: true });
                    
                    const requestStore = db.createObjectStore(REQUESTS_STORE, { keyPath: 'id' });
                    requestStore.createIndex('by-requester', 'requester');
                    requestStore.createIndex('by-status', 'status');
                }
            },
        });
    }
    return dbPromise;
};

// Seed initial admin user if database is empty
export const seedInitialUsers = async () => {
    const db = await getDb();
    const count = await db.count(USERS_STORE);
    if (count === 0) {
        console.log('No users found, seeding initial users...');
        const tx = db.transaction(USERS_STORE, 'readwrite');
        await Promise.all(MOCK_USERS.map(user => tx.store.add(user)));
        await tx.done;
    }
};

// --- User Management Functions ---

export const getAllUsers = async (): Promise<User[]> => {
    const db = await getDb();
    return db.getAll(USERS_STORE);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const db = await getDb();
    return db.get(USERS_STORE, id);
};

export const addUser = async (user: User): Promise<void> => {
    const db = await getDb();
    await db.add(USERS_STORE, user);
};

export const updateUser = async (user: User): Promise<void> => {
    const db = await getDb();
    await db.put(USERS_STORE, user);
};

export const deleteUser = async (userId: string): Promise<void> => {
    const db = await getDb();
    await db.delete(USERS_STORE, userId);
};

// --- Change Request Functions ---

export const getAllChangeRequests = async (): Promise<ChangeRequest[]> => {
    const db = await getDb();
    const requests = await db.getAll(REQUESTS_STORE);
    // Sort by request date descending to show newest first
    return requests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
};

export const addChangeRequest = async (request: ChangeRequest): Promise<void> => {
    const db = await getDb();
    await db.add(REQUESTS_STORE, request);
};

export const updateChangeRequest = async (request: ChangeRequest): Promise<void> => {
    const db = await getDb();
    await db.put(REQUESTS_STORE, request);
};

export const getChangeRequestById = async (id: string): Promise<ChangeRequest | undefined> => {
    const db = await getDb();
    return db.get(REQUESTS_STORE, id);
}