import { supabase } from '../lib/supabaseClient';

export interface Product {
    id: string;
    title: string;
    description: string;
    detailed_description: string;
    image_url: string;
    images: any;
    price: number;
    category: string;
    stock: number;
    rating: number;
    features: any;
    link: string;
    created_at?: string;
}

export const productService = {
    async getAll() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as Product[];
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data as Product;
    },

    async create(product: Omit<Product, 'created_at'>) {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();
        if (error) throw error;
        return data[0] as Product;
    },

    async update(id: string, product: Partial<Product>) {
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0] as Product;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getCount() {
        const { count, error } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });
        if (error) throw error;
        return count || 0;
    }
};
