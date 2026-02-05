import { supabase } from '../lib/supabase';
import type { Group } from '../types';

export const groupsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('groups')
            .select('*, enrollments(student_id)')
            .order('name');

        console.log('Groups fetch result:', { data, error });

        if (error) throw error;

        return data.map(g => ({
            id: g.id,
            name: g.name,
            courseId: g.course_id,
            teacherId: g.teacher_id,
            schedule: g.schedule,
            studentIds: g.enrollments?.map((e: any) => e.student_id) || []
        })) as Group[];
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('groups')
            .select('*, enrollments(student_id)')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            courseId: data.course_id,
            teacherId: data.teacher_id,
            schedule: data.schedule,
            studentIds: data.enrollments?.map((e: any) => e.student_id) || []
        } as Group;
    },

    async create(group: Omit<Group, 'id' | 'studentIds'>) {
        const { data, error } = await supabase
            .from('groups')
            .insert({
                name: group.name,
                course_id: group.courseId,
                teacher_id: group.teacherId,
                schedule: group.schedule
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, group: Partial<Omit<Group, 'id' | 'studentIds'>>) {
        const updates: any = {};
        if (group.name) updates.name = group.name;
        if (group.courseId) updates.course_id = group.courseId;
        if (group.teacherId) updates.teacher_id = group.teacherId;
        if (group.schedule) updates.schedule = group.schedule;

        const { data, error } = await supabase
            .from('groups')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        // Business rule: a group cannot be deleted if it has enrollments
        const { count, error: checkError } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', id);

        if (checkError) throw checkError;
        if (count && count > 0) {
            throw new Error('Нельзя удалить группу, в которой есть студенты');
        }

        const { error } = await supabase
            .from('groups')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async enrollStudent(groupId: string, studentId: string) {
        const { error } = await supabase
            .from('enrollments')
            .insert({
                group_id: groupId,
                student_id: studentId
            });

        if (error) throw error;
    },

    async unenrollStudent(groupId: string, studentId: string) {
        const { error } = await supabase
            .from('enrollments')
            .delete()
            .eq('group_id', groupId)
            .eq('student_id', studentId);

        if (error) throw error;
    }
};
