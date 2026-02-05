import { supabase } from '../lib/supabase';
import type { Student } from '../types';

export const studentsService = {
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*, enrollments(groups(name))')
                .order('full_name');

            if (error) {
                console.warn('First attempt to fetch students failed, trying without avatar_url:', error);
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('students')
                    .select('id, full_name, email, phone, status, registration_date, enrollments(groups(name))')
                    .order('full_name');

                if (fallbackError) throw fallbackError;

                return fallbackData.map(s => ({
                    id: s.id,
                    fullName: s.full_name,
                    email: s.email,
                    phone: s.phone,
                    status: s.status,
                    registrationDate: s.registration_date,
                    group: (s.enrollments as any)?.[0]?.groups?.name || '',
                    avatarUrl: ''
                })) as Student[];
            }

            if (!data) return [];

            return data.map(s => ({
                id: s.id,
                fullName: s.full_name,
                email: s.email,
                phone: s.phone,
                status: s.status,
                registrationDate: s.registration_date,
                group: (s.enrollments as any)?.[0]?.groups?.name || '',
                avatarUrl: s.avatar_url || ''
            })) as Student[];
        } catch (error) {
            console.error('Students Service Error [getAll]:', error);
            return [];
        }
    },

    async getById(id: string) {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*, enrollments(groups(*))')
                .eq('id', id)
                .single();

            if (error) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('students')
                    .select('id, full_name, email, phone, status, registration_date, enrollments(groups(*))')
                    .eq('id', id)
                    .single();

                if (fallbackError) throw fallbackError;

                return {
                    ...fallbackData,
                    fullName: fallbackData.full_name,
                    registrationDate: fallbackData.registration_date,
                    group: (fallbackData.enrollments as any)?.[0]?.groups?.name || '',
                    avatarUrl: ''
                } as Student;
            }

            return {
                ...data,
                fullName: data.full_name,
                registrationDate: data.registration_date,
                group: (data.enrollments as any)?.[0]?.groups?.name || '',
                avatarUrl: data.avatar_url || ''
            } as Student;
        } catch (error) {
            console.error(`Students Service Error [getById:${id}]:`, error);
            throw error;
        }
    },

    async create(student: Omit<Student, 'id' | 'registrationDate' | 'group'>) {
        const { data, error } = await supabase
            .from('students')
            .insert({
                full_name: student.fullName,
                email: student.email,
                phone: student.phone,
                status: student.status,
                avatar_url: student.avatarUrl
            })
            .select()
            .single();

        if (error) {
            console.error('Students Service Error [create]:', error);
            throw error;
        }

        return data;
    },

    async update(id: string, student: Partial<Omit<Student, 'id' | 'registrationDate' | 'group'>>) {
        const updates: any = {};
        if (student.fullName) updates.full_name = student.fullName;
        if (student.email) updates.email = student.email;
        if (student.phone) updates.phone = student.phone;
        if (student.status) updates.status = student.status;
        if (student.avatarUrl !== undefined) updates.avatar_url = student.avatarUrl;

        const { data, error } = await supabase
            .from('students')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Students Service Error [update:${id}]:`, error);
            throw error;
        }

        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Students Service Error [delete:${id}]:`, error);
            throw error;
        }
    }
};
