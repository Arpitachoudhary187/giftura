import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  totalAmount: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const newItems = existing
            ? state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
              )
            : [...state.items, { ...item, quantity: 1 }];
          return {
            items: newItems,
            totalAmount: newItems.reduce((s, i) => s + i.price * i.quantity, 0),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          return { items: newItems, totalAmount: newItems.reduce((s, i) => s + i.price * i.quantity, 0) };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newItems =
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i));
          return { items: newItems, totalAmount: newItems.reduce((s, i) => s + i.price * i.quantity, 0) };
        });
      },

      clearCart: () => set({ items: [], totalAmount: 0 }),

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'giftura-cart' }
  )
);
