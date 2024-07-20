import React from 'react';
import { useCart } from '../CartContext';

const Cart = () => {
    const { cart, removeFromCart } = useCart();

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map(item => (
                        <li key={item.id}>
                            <img src={item.image} alt={item.title} width="50" />
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.price}</p>
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
