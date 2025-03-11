// src/pages/BookDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { getBookById } from '../services/BookService';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBookById(id);
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          className="mt-4 flex items-center text-gold hover:underline"
          onClick={() => navigate('/books')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Books
        </button>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Book not found</span>
        </div>
        <button 
          className="mt-4 flex items-center text-gold hover:underline"
          onClick={() => navigate('/books')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Books
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        className="mb-6 flex items-center text-gold hover:underline"
        onClick={() => navigate('/books')}
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Books
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book image */}
        <div className="flex justify-center">
          <img 
            src={imageError ? '/images/default-book-cover.jpg' : book.urlImage || `/images/books/${book.id}.jpg`} 
            alt={book.title} 
            className="rounded-lg shadow-lg max-h-96 object-contain"
            onError={handleImageError}
          />
        </div>
        
        {/* Book details */}
        <div>
          <h1 className="text-3xl font-bold text-gold mb-2">{book.title}</h1>
          <p className="text-lg text-gray-600 mb-4">By {book.author}</p>
          
          <div className="mb-4">
            <span className="text-2xl font-bold text-gold">${book.price.toFixed(2)}</span>
            {book.stock > 0 ? (
              <span className="ml-3 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                In Stock ({book.stock} available)
              </span>
            ) : (
              <span className="ml-3 text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{book.description || 'No description available.'}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <ul className="text-gray-700">
              <li><span className="font-medium">Publisher:</span> {book.publisher.name}</li>
              <li><span className="font-medium">Genre:</span> {book.genre}</li>
              <li><span className="font-medium">Added:</span> {new Date(book.createdAt).toLocaleDateString()}</li>
              <li><span className="font-medium">Last Updated:</span> {new Date(book.updatedAt).toLocaleDateString()}</li>
            </ul>
          </div>
          
          <button 
            className="w-full md:w-auto bg-gold text-black py-3 px-6 rounded-md hover:bg-gold-light transition-colors flex items-center justify-center"
            disabled={book.stock === 0}
          >
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;