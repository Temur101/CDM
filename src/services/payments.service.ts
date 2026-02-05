import { supabase } from '../lib/supabase';
import type { Payment } from '../types';

export const paymentsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('payments')
            .select('*, students(full_name)')
            .order('date', { ascending: false });

        console.log('Payments Service [getAll]:', { data, error });

        if (error) {
            console.error('Payments Service Error [getAll]:', error);
            throw error;
        }

        return data.map(p => ({
            id: p.id,
            studentId: p.student_id,
            studentName: p.students?.full_name || '',
            amount: p.amount,
            date: p.date,
            status: p.status,
            method: p.method
        }));
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('payments')
            .select('*, students(full_name)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(payment: Omit<Payment, 'id' | 'date'>) {
        if (payment.amount <= 0) {
            throw new Error('Сумма платежа должна быть больше 0');
        }

        const { data, error } = await supabase
            .from('payments')
            .insert({
                student_id: payment.studentId,
                amount: payment.amount,
                status: payment.status,
                method: payment.method
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, payment: Partial<Omit<Payment, 'id' | 'date'>>) {
        const updates: any = {};
        if (payment.studentId) updates.student_id = payment.studentId;
        if (payment.amount) updates.amount = payment.amount;
        if (payment.status) updates.status = payment.status;
        if (payment.method) updates.method = payment.method;

        const { data, error } = await supabase
            .from('payments')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('payments')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
