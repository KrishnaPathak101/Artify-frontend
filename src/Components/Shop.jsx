import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import axios from '../Components/axiosInstance';
import { Link } from 'react-router-dom';

const Yourwork = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [arts, setArts] = useState([]);

  useEffect(() => {
    if (user && isLoaded) {
      const getArts = async () => {
        try {
          const response = await axios.get(`/api/api/user/${user.id}`);
          const artsWithIndexes = response.data.map(art => ({
            ...art,
            currentImageIndex: 0,
          }));
          setArts(artsWithIndexes);
        } catch (error) {
          console.log(error);
          alert('Failed to fetch arts');
        }
      };
      getArts();
    }
  }, [user, isLoaded]);

  const handleNext = (index) => {
    setArts(prevArts =>
      prevArts.map((art, i) => {
        if (i === index) {
          const nextIndex = (art.currentImageIndex + 1) % art.images.length;
          return { ...art, currentImageIndex: nextIndex };
        }
        return art;
      })
    );
  };

  const handlePrev = (index) => {
    setArts(prevArts =>
      prevArts.map((art, i) => {
        if (i === index) {
          const prevIndex = (art.currentImageIndex - 1 + art.images.length) % art.images.length;
          return { ...art, currentImageIndex: prevIndex };
        }
        return art;
      })
    );
  };

  const handleDelete = async ( id) => {
    
    try {
      await axios.delete(`/api/api/art/${id}`);
      setArts(prevArts => prevArts.filter(art => art.id !== id));
      alert('Art deleted successfully');
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert('Failed to delete art');
    }
  };

  if (!isLoaded) {
    return (
      <div className="container w-[99%] mx-auto bg-slate-100 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Work</h1>
        <div className="w-full flex py-5 justify-center">
          <div className="flex flex-wrap gap-5 justify-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col gap-4 w-52">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <div>Please sign in to see your work.</div>;
  }

  return (
    <div className="container w-[99%] mx-auto bg-slate-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Work</h1>
      <div className="w-full flex py-5 justify-center">
        <div className="flex flex-wrap gap-5 justify-center">
          {arts.map((art, index) => (
            <div key={art._id} to={`/art/${art._id}`}>
              <div key={art._id} className="card relative w-96 bg-base-100 shadow-xl">
                <div onClick={() => handleDelete(art._id)} className=' cursor-pointer z-10 w-10 h-10 hover:bg-slate-200 transition  bg-slate-400 right-0 mr-2 mt-2 flex justify-center absolute items-center rounded-full '>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" size-6">
                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                  </svg>

                </div>
                <Link to={`/art/${art._id}`}>
                <div className="image-carousel  w-full h-60 relative">
                  {art.images && art.images.length > 0 ? (
                    <img className="w-full h-full object-contain" src={art.images[art.currentImageIndex]} alt={art.title} />
                  ) : (
                    <img className="w-full h-full object-contain" src="/placeholder-image.png" alt="Placeholder" />
                  )}
                  {art.images && art.images.length > 1 && (
                    <>
                      <button className="prev-btn absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2" onClick={() => handlePrev(index)}>‹</button>
                      <button className="next-btn absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2" onClick={() => handleNext(index)}>›</button>
                    </>
                  )}
                </div>
                <div className="card-body">
                  <h2 className="card-title">{art.title}</h2>
                  <p>{art.description}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Yourwork;
