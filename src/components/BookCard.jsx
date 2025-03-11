// src/components/BookCard.jsx
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const BookCard = ({ book, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  // Default image path if none is provided
  const imagePath = book.coverImage || `/images/books/${book.id}.jpg`;
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageError ? '/images/default-book-cover.jpg' : imagePath}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
          onClick={onClick}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-gold font-bold">${book.price.toFixed(2)}</span>
          
          {book.stock > 0 ? (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">Out of Stock</span>
          )}
        </div>
        
        <button 
          className="mt-3 w-full bg-gold text-black py-2 px-4 rounded hover:bg-gold-light transition-colors flex items-center justify-center"
          disabled={book.stock === 0}
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;