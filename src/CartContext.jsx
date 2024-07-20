import React, { createContext, useState, useEffect } from 'react';
import axios from './Components/axiosInstance';
import { useUser } from '@clerk/clerk-react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useUser();

    const addToCart = async (item) => {

      

        try {
            await axios.post('/api/cart', { item });
            loadCartItems();
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = (item) => {
        const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

        if (isItemInCart.quantity === 1) {
            setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
        } else {
            setCartItems(
                cartItems.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const loadCartItems = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/api/cart/${user.id}`);
            const data = await response.json();
            setCartItems(data);
            alert( 'Cart loaded successfully!');
            console.log( 'Cart loaded successfully!', data);
        } catch (error) {
            console.error(error);
            alert( 'Failed to load cart items!');
        }
    };

    useEffect(() => {
        loadCartItems();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                getCartTotal,
                setCartItems
            }}
        >
            {children}
        </CartContext.Provider>
    );
};