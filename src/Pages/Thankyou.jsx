import React from 'react';
import { Link } from 'react-router-dom';

const Thankyou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank you for your order!</h1>
        <p className="text-gray-600 mb-4">Your order has been received and will be processed shortly.</p>
        <p className="text-gray-600 mb-4">You will receive an email confirmation shortly.</p>
        <p className="text-gray-600 mb-4">If you have any questions or concerns, please don't hesitate to contact us.</p>
        <p className="text-gray-600 mb-4">We appreciate your business!</p>
        <p className="text-gray-600">Thank you again for your business!</p>
        <Link to="/">
      <button  className='btn btn-primary'> Home</button>
      </Link>
      </div>
      
    </div>
  );
};

export default Thankyou;
