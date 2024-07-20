// Checkout.js
import React from 'react';
import useCartStore from '../useCartStore';
import Payment from '../Components/Payment'; // Assuming Payment component handles Razorpay integration

const Checkout = () => {
    const { cartItems, getTotalPrice } = useCartStore();
    const totalPrice = getTotalPrice();
    
    return (
        <div className="container mx-auto my-10">
            <h1 className="text-2xl font-bold mb-5">Checkout</h1>
            <div className="bg-white shadow-md rounded-lg p-5">
                <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
                <ul>
                    {cartItems.map(item => (
                        <li key={item.artId} className="mb-2">
                            <div className="flex justify-between">
                                <span>{item.title}</span>
                                <span>${item.price.toFixed(2)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                <Payment amount={totalPrice} cartItems={cartItems} />
            </div>
        </div>
    );
};

export default Checkout;
