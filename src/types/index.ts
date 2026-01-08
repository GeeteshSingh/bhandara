export interface BhandaraEvent {
    id: string;
    title: string;
    description: string;
    type: 'bhandara' | 'langar' | 'other';
    lat: number;
    lng: number;
    address: string;
    city: 'Ujjain' | 'Indore';
    verifiedCount: number;
    notThereCount: number;
    createdAt: number; // Timestamp
    createdBy: string; // UserId
    status: 'active' | 'ended';
    imageUrl?: string;
}

export interface Comment {
    id: string;
    bhandaraId: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: number;
}

export interface User {
    uid: string;
    phoneNumber?: string;
    email?: string;
    displayName?: string;
}
