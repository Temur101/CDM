import { supabase } from '../lib/supabase';
import type { Teacher } from '../types';

export const teachersService = {
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('*')
                .order('full_name');

            if (error) {
                console.warn('First attempt to fetch teachers failed, trying without avatar_url:', error);
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('teachers')
                    .select('id, full_name, email, phone, specialty, experience')
                    .order('full_name');

                if (fallbackError) throw fallbackError;

                return fallbackData.map(t => ({
                    id: t.id,
                    fullName: t.full_name,
                    email: t.email,
                    phone: t.phone,
                    specialty: t.specialty,
                    experience: t.experience,
                    avatarUrl: ''
                })) as Teacher[];
            }

            return data.map(t => ({
                id: t.id,
                fullName: t.full_name,
                email: t.email,
                phone: t.phone,
                specialty: t.specialty,
                experience: t.experience,
                avatarUrl: t.avatar_url || ''
            })) as Teacher[];
        } catch (error) {
            console.error('Final error in teachersService.getAll:', error);
            return [];
        }
    },

    async getById(id: string) {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('teachers')
                    .select('id, full_name, email, phone, specialty, experience')
                    .eq('id', id)
                    .single();

                if (fallbackError) throw fallbackError;

                return {
                    id: fallbackData.id,
                    fullName: fallbackData.full_name,
                    email: fallbackData.email,
                    phone: fallbackData.phone,
                    specialty: fallbackData.specialty,
                    experience: fallbackData.experience,
                    avatarUrl: ''
                } as Teacher;
            }

            return {
                id: data.id,
                fullName: data.full_name,
                email: data.email,
                phone: data.phone,
                specialty: data.specialty,
                experience: data.experience,
                avatarUrl: data.avatar_url || ''
            } as Teacher;
        } catch (error) {
            console.error(`Error in teachersService.getById(${id}):`, error);
            throw error;
        }
    },

    async create(teacher: Omit<Teacher, 'id'>) {
        const { data, error } = await supabase
            .from('teachers')
            .insert({
                full_name: teacher.fullName,
                email: teacher.email,
                phone: teacher.phone,
                specialty: teacher.specialty,
                experience: teacher.experience,
                avatar_url: teacher.avatarUrl
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, teacher: Partial<Omit<Teacher, 'id'>>) {
        const updates: any = {};
        if (teacher.fullName) updates.full_name = teacher.fullName;
        if (teacher.email) updates.email = teacher.email;
        if (teacher.phone) updates.phone = teacher.phone;
        if (teacher.specialty) updates.specialty = teacher.specialty;
        if (teacher.experience) updates.experience = teacher.experience;
        if (teacher.avatarUrl !== undefined) updates.avatar_url = teacher.avatarUrl;

        const { data, error } = await supabase
            .from('teachers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('teachers')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
