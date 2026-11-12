import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { SarprasItem, LoanRequest } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with Database ID from config (handles "(default)", "default", or named DB)
const rawDbId = firebaseConfig.firestoreDatabaseId;
const dbId =
  !rawDbId || rawDbId === 'default' || rawDbId === '(default)'
    ? undefined
    : rawDbId;

export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Test Connection Helper
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection successful!');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database is provisioning.');
    } else {
      console.log('Firestore connection checked:', error);
    }
    return false;
  }
}

// Real-time Firestore Listeners
export function subscribeToSarprasItems(
  onUpdate: (items: SarprasItem[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, 'sarpras_items');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const itemsList: SarprasItem[] = [];
      snapshot.forEach((docSnap) => {
        itemsList.push(docSnap.data() as SarprasItem);
      });
      onUpdate(itemsList);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'sarpras_items');
      if (onError) onError(err);
    }
  );
}

export function subscribeToSarprasLoans(
  onUpdate: (loans: LoanRequest[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, 'sarpras_loans');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const loansList: LoanRequest[] = [];
      snapshot.forEach((docSnap) => {
        loansList.push(docSnap.data() as LoanRequest);
      });
      onUpdate(loansList);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'sarpras_loans');
      if (onError) onError(err);
    }
  );
}

// Firestore Writes
export async function saveItemToFirestore(item: SarprasItem): Promise<void> {
  try {
    await setDoc(doc(db, 'sarpras_items', item.id), item);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `sarpras_items/${item.id}`);
  }
}

export async function deleteItemFromFirestore(itemId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'sarpras_items', itemId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `sarpras_items/${itemId}`);
  }
}

export async function saveLoanToFirestore(loan: LoanRequest): Promise<void> {
  try {
    await setDoc(doc(db, 'sarpras_loans', loan.id), loan);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `sarpras_loans/${loan.id}`);
  }
}

// Delete all documents in Firestore collections (to start empty)
export async function clearAllFirestoreData(): Promise<void> {
  try {
    const itemsCol = collection(db, 'sarpras_items');
    const loansCol = collection(db, 'sarpras_loans');

    const [itemsSnap, loansSnap] = await Promise.all([
      getDocs(itemsCol),
      getDocs(loansCol),
    ]);

    const batch = writeBatch(db);
    itemsSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    loansSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
    console.log('Semua data Firestore berhasil dikosongkan.');
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, 'sarpras_collections_clear');
  }
}

// Seed initial mock data into Firestore only when explicitly requested
export async function seedInitialFirestoreData(
  items: SarprasItem[],
  loans: LoanRequest[]
): Promise<void> {
  try {
    const itemsCol = collection(db, 'sarpras_items');
    const existingItems = await getDocs(itemsCol);

    if (existingItems.empty) {
      console.log('Seeding initial sarpras items to Cloud Firestore...');
      const batch = writeBatch(db);
      for (const itm of items) {
        batch.set(doc(db, 'sarpras_items', itm.id), itm);
      }
      for (const ln of loans) {
        batch.set(doc(db, 'sarpras_loans', ln.id), ln);
      }
      await batch.commit();
      console.log('Initial data seeded successfully to Firestore!');
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'sarpras_items_seed');
  }
}

// Google Auth Helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
}
