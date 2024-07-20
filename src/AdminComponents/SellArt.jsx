import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";

const SellArt = () => {
    const categories = ['All', 'Graphics', 'Fonts', 'Mockups', 'Logos', 'Illustrations', 'Videos', 'Tutorials', 'Others'];
    const [active, setActive] = useState(0);
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const { isSignedIn, user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { artId } = useParams();

    useEffect(() => {
        if (artId) {
            const getArtInfo = async () => {
                try {
                    const response = await fetch(`/api/api/art/${artId}`);
                    const data = await response.json(); 
                    console.log(data);
                    setTitle(data.title);
                    setDescription(data.description);
                    setPrice(data.price);
                    setImages(data.images);
                    setActive(categories.indexOf(data.category));
                } catch (error) {
                    console.error(error);
                    alert('Failed to fetch art');
                }
            };
            getArtInfo();
        }
    }, [artId]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prevImages => [...prevImages, ...files]);
    };

    const removeImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        const formData = new FormData();
        formData.append('category', categories[active]);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        images.forEach((image, index) => {
            if (typeof image === 'string') {
                // Add the URL string directly for existing images
                formData.append('existingImages', image);
            } else {
                // Append new images as files
                formData.append('images', image);
            }
        });
        formData.append('userId', user.id);
        const url = artId ? `/api/api/sell-art/${artId}` : '/api/api/sell-art';
        try {
            const response = await fetch(`${url}`, {
                method: artId ? 'PUT' : 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Success:', data);
                setSuccess(true);
            } else {
                throw new Error(data.error || 'Failed to upload artwork.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload artwork. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
                navigate('/shop');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    return (
        <div className='relative rounded-md w-full pb-5 bg-slate-200'>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <span className="loading loading-spinner text-primary"></span>
                        <p className="mt-2 text-lg">Publishing...</p>
                    </div>
                </div>
            )}
            {success && (
                <div className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2">Your artwork has been successfully published!</span>
                </div>
            )}
            <div className='mx-10'>
                <div className='py-5'>
                    <h1 className='text-3xl font-bold'>Create Your Work</h1>
                </div>
                <div className='rounded-lg my-5 w-full bg-white'>
                    <div className='ml-5 py-5'>
                        <h2 className='text-xl'>Which of these categories best describes your work?</h2>
                    </div>
                    <div className='cursor-pointer flex gap-4 items-center justify-evenly'>
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => setActive(index)}
                                className={`text-center rounded-md font-bold px-3 py-2 ${active === index ? 'bg-slate-400 text-white' : 'bg-white text-black border border-gray-300'}`}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className='ml-5 w-full py-5'>
                        <div className='py-5'>
                            <h1 className='text-xl'>Upload Some Photos Of Your Artwork</h1>
                            <label className='my-5 flex items-center justify-center text-center w-[200px] h-[100px] bg-slate-300 rounded-md cursor-pointer'>
                                Upload Images
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className='hidden'
                                />
                            </label>
                            <div className='mt-4 flex flex-wrap gap-4'>
                                {images.map((image, index) => (
                                    <div key={index} className='relative'>
                                        <img
                                            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                            alt={`Artwork ${index + 1}`}
                                            className='w-[200px] h-[200px] object-cover rounded-md'
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='w-full py-5'>
                            <h1 className='py-5 font-bold text-2xl'>Fill Out The Details</h1>
                            <div className='py-3 flex flex-col'>
                                <label className='py-2 font-bold'>Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder=" Enter title here"
                                    className="input input-bordered w-full max-w-xl"
                                />
                            </div>
                            <div className='py-5 flex flex-col'>
                                <label className='py-2 font-bold'>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description here"
                                    className="textarea textarea-bordered textarea-lg w-full max-w-xl"
                                ></textarea>
                            </div>
                            <div className='py-5 flex flex-col'>
                                <label className='py-2 font-bold'>Your Price $</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder=" Enter price here"
                                    className="input input-bordered w-full max-w-xl"
                                />
                            </div>
                        </div>
                        <button type="submit" className='bg-blue-500 text-white rounded-md ml-5 px-5 py-2'>
                            Publish Your Work
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellArt;
