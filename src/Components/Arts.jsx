import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../useCartStore';
import { SearchContext } from '../SearchContext';

const Arts = () => {
    const [artsData, setArtsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Adjust as needed
    const { addToCart } = useCartStore();
    const { searchTerm, category } = useContext(SearchContext);

    useEffect(() => {
        const getArts = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/api/art'); // Adjust URL if needed
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setArtsData(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching arts data:', error);
            } finally {
                setLoading(false);
            }
        };

        getArts();
    }, []);

    const filteredArtsData = useMemo(() => {
        let filteredData = artsData;

        if (category !== 'All') {
            filteredData = filteredData.filter(art => art.category === category);
        }

        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            filteredData = filteredData.filter(art =>
                art.title.toLowerCase().includes(lowercasedSearch)
            );
        }

        return filteredData;
    }, [artsData, category, searchTerm]);

    const handlePrev = useCallback(() => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    }, []);

    const handleNext = useCallback(() => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredArtsData.length / itemsPerPage) - 1));
    }, [filteredArtsData.length]);

    const paginatedArts = useMemo(() => {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredArtsData.slice(start, end);
    }, [filteredArtsData, currentPage]);

    const renderedArts = useMemo(() => {
        return paginatedArts.map((art, index) => (
            <div key={art._id} className="relative flex justify-center">
                <div className="card mx-2 w-full bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                    <Link to={`/artpage/${art._id}`}>
                        <div className="image-carousel relative">
                            {art.images && art.images.length > 0 ? (
                                <img loading="lazy" className="w-full h-56 object-cover" src={art.images[0]} alt={art.title} />
                            ) : (
                                <img loading="lazy" className="w-full h-56 object-cover" src="/placeholder-image.png" alt="Placeholder" />
                            )}
                            {art.images && art.images.length > 1 && (
                                <>
                                    <button className="prev-btn absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full" onClick={handlePrev}>‹</button>
                                    <button className="next-btn absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full" onClick={handleNext}>›</button>
                                </>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold truncate">{art.title}</h2>
                            <div className="mt-2 flex justify-end">
                                <button onClick={(e) => { e.preventDefault(); addToCart(art); }} className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Add to cart</button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        ));
    }, [paginatedArts, handlePrev, handleNext, addToCart]);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-6">
                {loading ? (
                    <span className="loading loading-spinner text-primary mx-auto"></span>
                ) : artsData.length === 0 ? (
                    <p className="text-center">No arts available.</p>
                ) : (
                    renderedArts
                )}
            </div>
            <div className="pagination mt-4 flex justify-center space-x-4">
                <button onClick={handlePrev} disabled={currentPage === 0} className="btn btn-secondary px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Previous</button>
                <button onClick={handleNext} disabled={currentPage >= Math.ceil(filteredArtsData.length / itemsPerPage) - 1} className="btn btn-secondary px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Next</button>
            </div>
        </div>
    );
};

export default Arts;
