// src/components/Header.jsx
import React, { useContext, useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from 'react-router-dom';
import useAxiosInstance from '../Components/axiosInstance';
import useCartStore from '../useCartStore';
import { SearchContext } from '../SearchContext';

const Header = () => {
    const { isSignedIn, user, isLoaded } = useUser();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartItems, cartCount, loading, addToCart, removeFromCart, toggleCart, loadCartItems, getTotalPrice } = useCartStore();
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm } = useContext(SearchContext);
    const axiosInstance = useAxiosInstance();

    useEffect(() => {
        if (user && isLoaded) {
            handleUserRegistration();
            loadCartItems(user.id);
        }
    }, [user, isLoaded, loadCartItems]);

    const handleUserRegistration = async () => {
        try {
            await axiosInstance.post('/api/api/user', {
                UserId: user.id,
                fullName: user.fullName,
                Email: user.primaryEmailAddress.emailAddress,
                imageurl: user.imageUrl,
                username: user.username,
            }, );
        } catch (error) {
            console.log("Header.jsx user registration error:", error);
        }
    };

    const handleCheckout = () => {
        toggleCart();
        navigate('/checkout');
    };

    const handleToggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">ArtiSELL</Link>
            </div>
            <div className="flex-none gap-2">
                <div className="form-control">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="input input-bordered w-24 md:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                    {isSignedIn && (
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li>
                                <Link to="/sellart" className="justify-between">
                                    Sell Your Art
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><a>Wishlist</a></li>
                            <li><a>Orders</a></li>
                            <li><Link to="/shop">Your Shop</Link></li>
                        </ul>
                    )}
                </div>
                <div className={`drawer drawer-end ${isCartOpen ? 'open' : ''}`}>
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked={isCartOpen} readOnly />
                    <div className="drawer-content">
                        <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary relative" onClick={handleToggleCart}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 21.75a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
                            </svg>
                        </label>
                        <div className='absolute top-0 right-0 '>
                            {cartItems.length > 0 && <div className="badge badge-secondary">{cartItems.length}</div>}

                        </div>
                    </div>
                    <div className="drawer-side z-10">
                        <label htmlFor="my-drawer-4" className="drawer-overlay" onClick={handleToggleCart}></label>
                        <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
                            <button onClick={handleToggleCart} className="btn btn-primary">Close</button>
                            {!loading ? (
                                cartItems ? (
                                    cartItems.map(item => (
                                        <li key={item.artId}>
                                            <div>
                                                <p>{item.title}</p>
                                                <p>${item.price}</p>
                                                <button onClick={() => removeFromCart(user.id, item.artId)}>Remove</button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No items in cart</li>
                                )
                            ) : (
                                <span className="loading loading-dots loading-lg"></span>
                            )}
                            <button className="btn btn-primary mt-4" onClick={handleCheckout}>Checkout</button>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
