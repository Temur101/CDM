export interface Student {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending';
    registrationDate: string;
    group?: string;
    avatarUrl?: string;
}

export interface Course {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    color: string;
}

export interface Group {
    id: string;
    name: string;
    courseId: string;
    teacherId: string;
    studentIds: string[];
    schedule: string;
}

export interface Teacher {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    specialty: string;
    experience: string;
    avatarUrl?: string;
}

export interface Payment {
    id: string;
    studentId: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'failed';
    method: string;
}
