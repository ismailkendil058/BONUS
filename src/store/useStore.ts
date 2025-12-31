import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { Worker, Product, SaleEntry, CartItem } from '@/types';

interface AppState {
  // Init
  isInitialized: boolean;

  // Auth
  currentWorker: Worker | null;
  isAdmin: boolean;
  
  // Data
  workers: Worker[];
  products: Product[];
  sales: SaleEntry[];
  
  // Cart
  cart: CartItem[];
  
  // Loading
  isLoading: boolean;
  
  // Actions - Init
  initialize: () => void;

  // Actions - Data
  fetchWorkers: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchSales: () => Promise<void>;
  fetchAll: () => Promise<void>;
  
  // Actions - Auth
  loginWorker: (pin: string) => Promise<Worker | null>;
  loginAdmin: (pin: string) => Promise<boolean>;
  logout: () => void;
  
  // Actions - Workers
  addWorker: (name: string, pin: string) => Promise<boolean>;
  updateWorker: (id: string, updates: Partial<Worker>) => Promise<void>;
  deleteWorker: (id: string) => Promise<void>;
  
  // Actions - Products
  addProduct: (name: string, points: number, quantity: number) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Actions - Cart
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Actions - Sales
  confirmSale: () => Promise<void>;
  confirmReturn: () => Promise<void>;
  
  // Getters
  getWorkerPoints: (workerId: string, month?: number, year?: number) => number;
  getWorkerSalary: (workerId: string, month?: number, year?: number) => number;
  getMonthlyRankings: (month?: number, year?: number) => { worker: Worker; points: number; salary: number }[];
}

const POINT_VALUE = 10; // 1 point = 10 DA

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isInitialized: false,
      currentWorker: null,
      isAdmin: false,
      workers: [],
      products: [],
      sales: [],
      cart: [],
      isLoading: false,

      // Init action
      initialize: () => {
        set({ isInitialized: true });
      },

      // Fetch data from Supabase
      fetchWorkers: async () => {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (!error && data) {
          const workers: Worker[] = data.map(w => ({
            id: w.id,
            name: w.name,
            pin: w.pin,
            active: w.active,
            createdAt: new Date(w.created_at),
          }));
          set({ workers });
        }
      },

      fetchProducts: async () => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('points', { ascending: true });
        
        if (!error && data) {
          const products: Product[] = data.map(p => ({
            id: p.id,
            name: p.name,
            points: p.points,
            quantity: p.quantity,
            active: p.active,
            createdAt: new Date(p.created_at),
          }));
          set({ products });
        }
      },

      fetchSales: async () => {
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (salesError || !salesData) return;

        const { data: itemsData, error: itemsError } = await supabase
          .from('sale_items')
          .select('*');
        
        if (itemsError || !itemsData) return;

        const sales: SaleEntry[] = salesData.map(sale => ({
          id: sale.id,
          workerId: sale.worker_id,
          totalPoints: sale.total_points,
          isReturn: sale.is_return,
          createdAt: new Date(sale.created_at),
          products: itemsData
            .filter(item => item.sale_id === sale.id)
            .map(item => ({
              productId: item.product_id,
              productName: item.product_name,
              quantity: item.quantity,
              points: item.points,
            })),
        }));
        
        set({ sales });
      },

      fetchAll: async () => {
        set({ isLoading: true });
        await Promise.all([
          get().fetchWorkers(),
          get().fetchProducts(),
          get().fetchSales(),
        ]);
        set({ isLoading: false });
      },

      // Auth actions
      loginWorker: async (pin: string) => {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .eq('pin', pin)
          .eq('active', true)
          .maybeSingle();
        
        if (!error && data) {
          const worker: Worker = {
            id: data.id,
            name: data.name,
            pin: data.pin,
            active: data.active,
            createdAt: new Date(data.created_at),
          };
          set({ currentWorker: worker, isAdmin: false });
          return worker;
        }
        return null;
      },

      loginAdmin: async (pin: string) => {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('admin_pin')
          .limit(1)
          .maybeSingle();
        
        if (!error && data && data.admin_pin === pin) {
          set({ isAdmin: true, currentWorker: null });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentWorker: null, isAdmin: false, cart: [] });
      },

      // Worker actions
      addWorker: async (name: string, pin: string) => {
        const { error } = await supabase
          .from('workers')
          .insert({ name, pin });
        
        if (!error) {
          await get().fetchWorkers();
          return true;
        }
        return false;
      },

      updateWorker: async (id: string, updates: Partial<Worker>) => {
        const dbUpdates: Record<string, unknown> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.pin !== undefined) dbUpdates.pin = updates.pin;
        if (updates.active !== undefined) dbUpdates.active = updates.active;

        await supabase
          .from('workers')
          .update(dbUpdates)
          .eq('id', id);
        
        await get().fetchWorkers();
      },

      deleteWorker: async (id: string) => {
        await supabase
          .from('workers')
          .delete()
          .eq('id', id);
        
        await get().fetchWorkers();
      },

      // Product actions
      addProduct: async (name: string, points: number, quantity: number) => {
        const { error } = await supabase
          .from('products')
          .insert({ name, points, quantity });
        
        if (!error) {
          await get().fetchProducts();
          return true;
        }
        return false;
      },

      updateProduct: async (id: string, updates: Partial<Product>) => {
        const dbUpdates: Record<string, unknown> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.points !== undefined) dbUpdates.points = updates.points;
        if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
        if (updates.active !== undefined) dbUpdates.active = updates.active;

        await supabase
          .from('products')
          .update(dbUpdates)
          .eq('id', id);
        
        await get().fetchProducts();
      },

      deleteProduct: async (id: string) => {
        await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        await get().fetchProducts();
      },

      // Cart actions
      addToCart: (product: Product) => {
        set(state => {
          const existing = state.cart.find(item => item.productId === product.id);
          if (existing) {
            return {
              cart: state.cart.map(item =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, {
              productId: product.id,
              productName: product.name,
              points: product.points,
              quantity: 1,
            }],
          };
        });
      },

      removeFromCart: (productId: string) => {
        set(state => ({
          cart: state.cart.filter(item => item.productId !== productId),
        }));
      },

      updateCartQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set(state => ({
          cart: state.cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // Sales actions
      confirmSale: async () => {
        const { cart, currentWorker } = get();
        if (!currentWorker || cart.length === 0) return;

        const totalPoints = cart.reduce((sum, item) => sum + (item.points * item.quantity), 0);
        
        // Insert sale
        const { data: saleData, error: saleError } = await supabase
          .from('sales')
          .insert({
            worker_id: currentWorker.id,
            total_points: totalPoints,
            is_return: false,
          })
          .select()
          .single();
        
        if (saleError || !saleData) return;

        // Insert sale items
        const saleItems = cart.map(item => ({
          sale_id: saleData.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          points: item.points,
        }));

        await supabase.from('sale_items').insert(saleItems);

        // Refresh data and clear cart
        await get().fetchSales();
        set({ cart: [] });
      },

      confirmReturn: async () => {
        const { cart, currentWorker, products } = get();
        if (!currentWorker || cart.length === 0) return;

        const totalPoints = cart.reduce((sum, item) => sum + (item.points * item.quantity), 0);
        
        // Insert return entry
        const { data: saleData, error: saleError } = await supabase
          .from('sales')
          .insert({
            worker_id: currentWorker.id,
            total_points: -totalPoints,
            is_return: true,
          })
          .select()
          .single();
        
        if (saleError || !saleData) return;

        // Insert sale items with negative quantity
        const saleItems = cart.map(item => ({
          sale_id: saleData.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: -item.quantity,
          points: item.points,
        }));

        await supabase.from('sale_items').insert(saleItems);

        // Add quantities back to products
        for (const item of cart) {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            await supabase
              .from('products')
              .update({ quantity: product.quantity + item.quantity })
              .eq('id', item.productId);
          }
        }

        // Refresh data and clear cart
        await Promise.all([get().fetchProducts(), get().fetchSales()]);
        set({ cart: [] });
      },

      // Getters
      getWorkerPoints: (workerId: string, month?: number, year?: number) => {
        const now = new Date();
        const targetMonth = month ?? now.getMonth();
        const targetYear = year ?? now.getFullYear();

        return get().sales
          .filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return sale.workerId === workerId &&
              saleDate.getMonth() === targetMonth &&
              saleDate.getFullYear() === targetYear;
          })
          .reduce((sum, sale) => sum + sale.totalPoints, 0);
      },

      getWorkerSalary: (workerId: string, month?: number, year?: number) => {
        return get().getWorkerPoints(workerId, month, year) * POINT_VALUE;
      },

      getMonthlyRankings: (month?: number, year?: number) => {
        const workers = get().workers.filter(w => w.active);
        const rankings = workers.map(worker => ({
          worker,
          points: get().getWorkerPoints(worker.id, month, year),
          salary: get().getWorkerSalary(worker.id, month, year),
        }));

        return rankings.sort((a, b) => b.points - a.points);
      },
    }),
    {
      name: 'sales-tracker-storage',
      partialize: (state) => ({ 
        currentWorker: state.currentWorker, 
        isAdmin: state.isAdmin,
        cart: state.cart,
      }),
    }
  )
);
