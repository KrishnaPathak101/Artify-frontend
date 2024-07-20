import create from 'zustand';
import axios from './Components/axiosInstance';

const useCartStore = create((set, get) => ({
    cartItems: [],
    cartCount: 0,
    isCartOpen: false,
    loading: false,

    addToCart: async (item) => {
        set({ loading: true });
        try {
            const response = await axios.post('/api/cart', {
                userId: item.userId,
                artId: item.artId,
                title: item.title,
                price: item.price,
                image: item.image,
            });

            set({
                cartItems: response.data.items,
                cartCount: response.data.items.length,
            });

            console.log("Added to cart:", response.data);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }

        set({ loading: false });
    },

    removeCart: async () => {
        try {
            set({ cartItems: [], cartCount: 0 });
            console.log('Cart items deleted:', response.data);
        } catch (error) {
            console.error('Error deleting from cart:', error);
        }
    },

    removeFromCart: async (userId, artId) => {
        if (!artId) return;
        set({ loading: true });

        try {
            const response = await axios.delete(`/api/api/cart/${userId}/${artId}`);

            if (response.data.message === 'Cart deleted') {
                set({ cartItems: [], cartCount: 0 });
            } else {
                set({
                    cartItems: response.data.items,
                    cartCount: response.data.items.length,
                });
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }

        set({ loading: false });
    },

    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

    loadCartItems: async (userId) => {
        if (!userId) return;
        set({ loading: true });
    
        try {
            const response = await axios.get(`/api/api/cart/${userId}`);
    
            if (Array.isArray(response.data)) {
                set({
                    cartItems: response.data,
                    cartCount: response.data.length,
                });
            } else {
                console.error("Failed to load cart items!", response.data);
            }
        } catch (error) {
            console.error("Failed to load cart items!", error);
        }
    
        set({ loading: false });
    },

    getTotalPrice: () => {
        return get().cartItems.reduce((total, item) => total + item.price, 0);
    },
}));

export default useCartStore;
