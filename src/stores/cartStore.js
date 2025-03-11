// src/stores/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      
      // Add to cart function
      addToCart: (book) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.book.id === book.id);
        
        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.book.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { book, quantity: 1 }] });
        }
      },
      
      // Remove from cart function
      removeFromCart: (bookId) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item.book.id !== bookId) });
      },
      
      // Update quantity function
      updateQuantity: (bookId, newQuantity) => {
        const { cart } = get();
        
        if (newQuantity < 1) {
          set({ cart: cart.filter((item) => item.book.id !== bookId) });
          return;
        }
        
        set({
          cart: cart.map((item) =>
            item.book.id === bookId ? { ...item, quantity: newQuantity } : item
          ),
        });
      },
      
      // Clear cart function
      clearCart: () => set({ cart: [] }),
      
      // Get total items in cart
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Get total price of cart
      getTotalPrice: () => {
        const { cart } = get();
        return cart.reduce(
          (total, item) => total + item.book.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    }
  )
);

export default useCartStore;