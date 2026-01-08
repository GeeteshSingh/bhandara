import type { BhandaraEvent } from '../types';
import { db } from './firebase';
import { collection, getDocs, addDoc, query, where, doc, updateDoc, increment } from 'firebase/firestore';

// Mock Data for initial dev
const MOCK_BHANDARAS: BhandaraEvent[] = [
    {
        id: '1',
        title: 'Mahakal Bhandara',
        description: 'Grand feast near Mahakal temple for all devotees.',
        type: 'bhandara',
        lat: 23.1815,
        lng: 75.7682,
        address: 'Mahakal Marg, Ujjain',
        city: 'Ujjain',
        verifiedCount: 150,
        notThereCount: 2,
        createdAt: Date.now(),
        createdBy: 'admin',
        status: 'active'
    },
    {
        id: '2',
        title: 'Indore Sarafa Langar',
        description: 'Community langar at Sarafa Bazar entrance.',
        type: 'langar',
        lat: 22.7196,
        lng: 75.8577,
        address: 'Sarafa Bazar, Indore',
        city: 'Indore',
        verifiedCount: 85,
        notThereCount: 0,
        createdAt: Date.now(),
        createdBy: 'admin',
        status: 'active'
    }
];

const USE_MOCK = true; // Toggle this to false when ready for real Firebase

export const BhandaraService = {
    // Get all active bhandaras
    getBhandaras: async (): Promise<BhandaraEvent[]> => {
        if (USE_MOCK) {
            return new Promise((resolve) => setTimeout(() => resolve(MOCK_BHANDARAS), 500));
        }
        try {
            const q = query(collection(db, 'bhandaras'), where('status', '==', 'active'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BhandaraEvent));
        } catch (error) {
            console.error("Error fetching bhandaras:", error);
            return [];
        }
    },

    // Add a new bhandara
    addBhandara: async (data: Omit<BhandaraEvent, 'id' | 'createdAt' | 'verifiedCount' | 'notThereCount'>): Promise<string> => {
        if (USE_MOCK) {
            const newId = Math.random().toString(36).substr(2, 9);
            MOCK_BHANDARAS.push({
                ...data,
                id: newId,
                createdAt: Date.now(),
                verifiedCount: 0,
                notThereCount: 0,
                status: 'active' // Ensure default logic matches
            } as BhandaraEvent);
            return newId;
        }
        const docRef = await addDoc(collection(db, 'bhandaras'), {
            ...data,
            createdAt: Date.now(),
            verifiedCount: 0,
            notThereCount: 0
        });
        return docRef.id;
    },

    // Verify (Upvote)
    verifyBhandara: async (id: string): Promise<void> => {
        if (USE_MOCK) {
            const item = MOCK_BHANDARAS.find(b => b.id === id);
            if (item) item.verifiedCount++;
            return;
        }
        const ref = doc(db, 'bhandaras', id);
        await updateDoc(ref, { verifiedCount: increment(1) });
    },

    // Report (Downvote/Not There)
    reportBhandara: async (id: string): Promise<void> => {
        if (USE_MOCK) {
            const item = MOCK_BHANDARAS.find(b => b.id === id);
            if (item) item.notThereCount++;
            return;
        }
        const ref = doc(db, 'bhandaras', id);
        await updateDoc(ref, { notThereCount: increment(1) });
    }
};
