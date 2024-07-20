import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../useCartStore';
import useAxiosInstance from './axiosInstance';
const Payment = ({ amount, cartItems }) => {
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const {removeCart} = useCartStore();
    const axiosInstance = useAxiosInstance();

    const handlePayment = async () => {
        try {
            // Make API call to create order
            const response = await axiosInstance.post('http://localhost:5000/createorder', {
                amount: amount * 100, // Convert to smallest currency unit
                currency: 'INR',
                receipt: 'order_rcptid_11',
                items: cartItems.map(item => ({
                    name: item.title,
                    quantity: 1,
                    description: `${item.title} - ${item.price}`,
                    amount: item.price,
                })),
            });

            // Initialize Razorpay
            const options = {
                key: 'rzp_test_gnh7o347IgEu2h',
                amount: response.data.amount,
                currency: response.data.currency,
                name: 'Your App Name',
                description: 'Payment for purchasing something',
                order_id: response.data.id,
                handler: async function (response) {
                    // Handle success scenario here
                    console.log('Payment successful:', response);
                    setShowModal(true); // Show confirmation modal
                    navigate('/'); // Redirect user to /Thankyou page
                    navigate('/Thankyou'); // Redirect user to /Thankyou page
                    deleteFromCart(); // Wait for function to delete from cart
                    sendEmail(); // Wait for function to send email and then navigate
                },
                prefill: {
                    name: user?.fullName || 'John Doe',
                    email: user?.emailAddresses[0]?.emailAddress || 'john.doe@example.com',
                    contact: user?.phoneNumbers[0]?.phoneNumber || '7895949201',
                },
                notes: {
                    address: 'Razorpay Corporate Office',
                },
                theme: {
                    color: '#F37254',
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteFromCart = async () => {
        try {
            // Make API call to delete from cart
            await axios.delete('http://localhost:5000/deletefromcart', {
                data: { cartItems }, // Send the cart items to delete
            });

            removeCart();
            console.log('Cart items deleted:', cartItems);
        } catch (error) {
            console.error('Error deleting from cart:', error);
        }
    };

    const sendEmail = async () => {
        try {
            // Make API call to send email
            await axios.post('http://localhost:5000/sendemail', {
                email: { referrerEmail: 'pathakkare@gmail.com', refereeEmail: user?.primaryEmailAddress.emailAddress },
            });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div>
            <button onClick={handlePayment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">
                Place Order
            </button>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
                        <p className="text-gray-700">Your order has been successfully placed.</p>
                        <button onClick={() => setShowModal(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
