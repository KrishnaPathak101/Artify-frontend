import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { CartContext } from '../CartContext'; // Adjust the import path accordingly
import useAxiosInstance from '../Components/axiosInstance';
import { useStore } from 'zustand';
import useCartStore from '../useCartStore';

const Artsdetail = () => {
    const [artData, setArtData] = useState(null);
    const { user } = useUser();
    const { addToCart, loading } = useCartStore();
    const { artId } = useParams();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const axiosInstance = useAxiosInstance();

    useEffect(() => {
        if (artId) {
            const getArtInfo = async () => {
                try {
                    const response = await axiosInstance.get(`api/art/${artId}`);
                    setArtData(response.data);
                    console.log(artData)
                } catch (error) {
                    console.error(error);
                }
            };
            getArtInfo();
        }
    }, [artId]);

    useEffect(() => {
        if (loading) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [loading]);

    if (!artData) {
        return <div>Loading...</div>;
    }


    const images = artData.images || [];

    const handleAddToCart = () => {
        addToCart({ userId: user.id, artId: artData._id, title: artData.title, price: artData.price, image: images[0] });
    };

  
    // if (!loading) {
    //     console.log(loading)
    // }

    return (
        <div className='w-full my-10 p-10'>
            <div>
                <h1>{artData.title}</h1>
            </div>
            <div className='rounded-md w-[500px] h-[500px] my-10'>
                <img
                    src={images[currentImageIndex || 0]}
                    alt={artData.title}
                    className='w-full rounded-md h-full object-cover'
                />
                <div className='flex gap-5 my-5 items-center w-[50px] h-[50px]'>
                    {images.length > 1 &&
                        images.map((image, index) => (
                            <img
                                onClick={() => setCurrentImageIndex(index)}
                                key={index}
                                src={image}
                                alt={artData.title}
                                className='w-full h-full object-cover focus:border-2 hover:scale-125 cursor-pointer'
                            />
                        ))}
                </div>
            </div>
            <div className='w-full pt-10'>
                <hr className='my-4 w-full' />
                <div className="flex cursor-pointer items-center">
                    <img
                        src={artData.user.imageurl}
                        className="w-10 h-10 bg-slate-200 rounded-full"
                        alt=""
                    />
                    <span className="ml-2">{artData.user.fullName}</span>
                </div>
                <hr className='mt-4' />
            </div>
            <div className='w-full py-5'>
                <h1 className='font-bold'>Description:</h1>
                <p>{artData.description}</p>
            </div>
            <div className='w-full py-5'>
                <h1 className='font-bold'>Pricing:</h1>
                <p>${artData.price}</p>
            </div>
            <div className='w-full py-5'>
                <button
                    onClick={handleAddToCart}
                    className="font-bold bg-blue-500 text-white rounded-md px-4 py-2"
                >
                    Add To Cart
                </button>
            </div>
            {
                showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className=' bg-white rounded-lg shadow-lg p-8'>
                             <p>Please Wait...</p>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Artsdetail;
