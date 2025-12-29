import { supabase } from '../lib/supabaseClient';

export interface Review {
    id: string;
    product_id: string;
    user_name: string;
    rating: number;
    comment: string;
    date: string;
    avatar: string;
    created_at?: string;
    products?: {
        title: string;
    };
}

export const reviewService = {
    async getAll() {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, products(title)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as Review[];
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getCount() {
        const { count, error } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
    },

    async getAverageRating() {
        const { data, error } = await supabase
            .from('reviews')
            .select('rating');
        if (error) throw error;
        if (data.length === 0) return 0;
        const sum = data.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0);
        return sum / data.length;
    }
};
