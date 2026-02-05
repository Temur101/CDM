import { supabase } from '../lib/supabase';
import type { Course } from '../types';

export const coursesService = {
    async getAll() {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('name');
        if (error) throw error;
        return data as Course[];
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data as Course;
    },

    async create(course: Omit<Course, 'id'>) {
        const { data, error } = await supabase
            .from('courses')
            .insert(course)
            .select()
            .single();
        if (error) throw error;
        return data as Course;
    },

    async update(id: string, course: Partial<Omit<Course, 'id'>>) {
        const { data, error } = await supabase
            .from('courses')
            .update(course)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as Course;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
