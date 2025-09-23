import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types/supabase';

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name_ar');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const getProductById = async (id: number): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.is_featured);
  };

  const getProductsByCategory = (categorySlug: string) => {
    return products.filter(product => product.category === categorySlug);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const addProduct = async (productData: any) => {
    try {
      // Remove any id field that might cause conflicts
      const { id, created_at, updated_at, ...cleanData } = productData;
      
      const { data, error } = await supabase
        .from('products')
        .insert([cleanData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Refresh products list
      await fetchProducts();
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error adding product:', err);
      return { data: null, error: errorMessage };
    }
  };

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchProducts,
    getProductById,
    getFeaturedProducts,
    getProductsByCategory,
    addProduct,
  };
};