import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WorkPage = () => {
  const { artId } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = useState({});
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    if (artId) {
      const getArtInfo = async () => {
        setLoading(true); // Start loading
        try {
          const response = await fetch(`/api/api/art/${artId}`);
          const art = await response.json();
          setArt(art);
        } catch (error) {
          console.log(error);
          alert('Failed to fetch art');
        } finally {
          setLoading(false); // End loading
        }
      };
      getArtInfo();
    }
  }, [artId]);

  const handleThumbnailClick = (index) => {
    setMainImageIndex(index);
  };

  const handleEditClick = () => {
    navigate(`/edit/${artId}`);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <span className="loading loading-spinner text-primary"></span>
            <p className="mt-2 text-lg">Publishing...</p>
          </div>
        </div>
      )}
      <div className="lg:w-3/4 p-4">
        <button
          className="btn btn-secondary mb-4"
          onClick={handleEditClick}
        >
          Edit
        </button>
        <h1 className="text-3xl font-bold mb-4">{art.title}</h1>
        {art.images && art.images.length > 0 && (
          <div className="flex flex-col items-center">
            <img
              src={art.images[mainImageIndex]}
              alt={art.title}
              className="w-full h-auto mb-4"
            />
            <div className="flex space-x-2 overflow-x-auto">
              {art.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${art.title} thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover cursor-pointer ${mainImageIndex === index ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="lg:w-1/4 p-4">
        <h2 className="text-2xl font-bold">Art Information</h2>
        <p className="mt-4"><strong>Price:</strong> {art.price}</p>
        <p><strong>Author:</strong> {art.author}</p>
        <p className="mt-4">{art.description}</p>
      </div>
    </div>
  );
};

export default WorkPage;
