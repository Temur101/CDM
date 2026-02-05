import type { Student, Course, Group, Teacher, Payment } from '../types';

export const mockStudents: Student[] = [
    { id: '1', fullName: 'Иван Иванов', email: 'ivan@example.com', phone: '+7 900 123 45 67', status: 'active', registrationDate: '2023-09-01', group: 'G1' },
    { id: '2', fullName: 'Мария Петрова', email: 'maria@example.com', phone: '+7 900 234 56 78', status: 'active', registrationDate: '2023-10-15', group: 'G1' },
    { id: '3', fullName: 'Алексей Сидоров', email: 'alex@example.com', phone: '+7 900 345 67 89', status: 'inactive', registrationDate: '2023-08-20', group: 'G2' },
    { id: '4', fullName: 'Елена Кузнецова', email: 'elena@example.com', phone: '+7 900 456 78 90', status: 'pending', registrationDate: '2024-01-10' },
    { id: '5', fullName: 'Дмитрий Волков', email: 'dima@example.com', phone: '+7 900 567 89 01', status: 'active', registrationDate: '2023-11-05', group: 'G3' },
];

export const mockCourses: Course[] = [
    { id: 'C1', name: 'Frontend Разработка', description: 'Основы HTML, CSS, React и TypeScript', price: 45000, duration: '6 месяцев', color: '#6366f1' },
    { id: 'C2', name: 'UI/UX Дизайн', description: 'Проектирование интерфейсов и работа в Figma', price: 35000, duration: '4 месяца', color: '#ec4899' },
    { id: 'C3', name: 'Python для начинающих', description: 'Основы программирования и data science', price: 40000, duration: '5 месяцев', color: '#10b981' },
];

export const mockTeachers: Teacher[] = [
    { id: 'T1', fullName: 'Александр Белов', specialty: 'Senior Frontend Engineer', experience: '8 лет', email: 'belov@crm.edu', phone: '+7 999 111 22 33' },
    { id: 'T2', fullName: 'Анна Романова', specialty: 'Product Designer', experience: '5 лет', email: 'romanova@crm.edu', phone: '+7 999 444 55 66' },
];

export const mockGroups: Group[] = [
    { id: 'G1', name: 'FE-2023-AUTO', courseId: 'C1', teacherId: 'T1', studentIds: ['1', '2'], schedule: 'Пн, Ср, Пт 19:00' },
    { id: 'G2', name: 'UI-2023-FALL', courseId: 'C2', teacherId: 'T2', studentIds: ['3'], schedule: 'Вт, Чт 18:30' },
    { id: 'G3', name: 'PY-2024-JAN', courseId: 'C3', teacherId: 'T1', studentIds: ['5'], schedule: 'Сб 10:00' },
];

export const mockPayments: Payment[] = [
    { id: 'P1', studentId: '1', amount: 15000, date: '2024-01-15', status: 'paid', method: 'card' },
    { id: 'P2', studentId: '2', amount: 45000, date: '2024-01-10', status: 'paid', method: 'transfer' },
    { id: 'P3', studentId: '4', amount: 5000, date: '2024-01-20', status: 'pending', method: 'card' },
];
