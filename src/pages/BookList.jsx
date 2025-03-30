// src/pages/BookList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, X, ChevronLeft, ChevronRight } from "lucide-react";
import useUserStore from "../stores/userStore";
import useCartStore from "../stores/cartStore";
import { getAllBooks } from "../api/books";
// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/starBackground.css';
function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useUserStore((state) => state.token);
  
  // Use cart store
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchBook(token);
  }, [token]);

  // Ref for stars container
  const starsContainerRef = useRef(null);

  useEffect(() => {
    fetchBook(token);
    
    // Initialize starry background
    initStars();
  }, [token]);
  
  // Initialize stars
  const initStars = () => {
    const container = starsContainerRef.current;
    if (!container) return;
    
    // Clear any existing stars
    container.innerHTML = '';
    
    // Create stars
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Random size (1-4px)
      const size = Math.random() * 3 + 1;
      
      // Random duration (3-8s)
      const duration = Math.random() * 5 + 3;
      
      // Random opacity (0.1-0.7)
      const opacity = Math.random() * 0.6 + 0.1;
      
      // Apply styles
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.setProperty('--opacity', opacity);
      
      // Add delay
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      // Add to container
      container.appendChild(star);
    }
    
    // Create a few larger, brighter stars
    for (let i = 0; i < 15; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 4 + 4; // 4-8px
      const duration = Math.random() * 6 + 4;
      const opacity = Math.random() * 0.3 + 0.7; // 0.7-1.0
      
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.setProperty('--opacity', opacity);
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`;
      
      container.appendChild(star);
    }
  };
  useEffect(() => {
    // Calculate total pages whenever books array changes
    setTotalPages(Math.ceil(books.length / booksPerPage));
  }, [books, booksPerPage]);

  const fetchBook = async (token) => {
    try {
      const res = await getAllBooks(token);
      setBooks(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Open book detail modal
  const openBookDetail = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  // Close book detail modal
  const closeBookDetail = () => {
    setIsModalOpen(false);
    // Optional: delay clearing the selected book to allow for exit animations
    setTimeout(() => setSelectedBook(null), 300);
  };

  // Pagination component
  const Pagination = () => {
    // Generate page numbers array
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    // Determine which page numbers to show
    let pagesToShow = [];
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      pagesToShow = pageNumbers;
    } else {
      // Always include first and last page
      if (currentPage <= 3) {
        // Near the start
        pagesToShow = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pagesToShow = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Somewhere in the middle
        pagesToShow = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    return (
      <div className="flex justify-center items-center mt-8 mb-4">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className={`mx-1 p-2 rounded-md ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
        >
          <ChevronLeft size={20} />
        </button>
        
        {pagesToShow.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && paginate(page)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === page 
                ? 'bg-yellow-600 text-black' 
                : page === '...' 
                  ? 'text-gray-400 cursor-default' 
                  : 'text-white hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          className={`mx-1 p-2 rounded-md ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  // BookCard component
  const BookCard = ({ book }) => {
    return (
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
        <div 
          className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:border-yellow-600 transition-all"
          onClick={() => openBookDetail(book)}
        >
          <img
            className="h-48 w-full object-cover"
            src={book.urlImage}
            alt={book.title}
          />
          <div className="p-4">
            <h2 className="text-lg font-bold text-white">{book.title}</h2>
            <p className="text-gray-400">{book.author}</p>
            <p className="text-yellow-500 font-bold">
              ${book.price.toFixed(2)}
            </p>
            <button
              className="mt-4 bg-yellow-600 text-black py-2 px-4 rounded hover:bg-yellow-500"
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening modal when clicking the button
                addToCart(book);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Book Detail Modal component
  const BookDetailModal = ({ book, isOpen, onClose }) => {
    if (!book) return null;

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
        <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
        <div className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden z-10 transform transition-transform duration-300 scale-100">
          <button 
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img 
                src={book.urlImage} 
                alt={book.title} 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <h2 className="text-2xl font-bold text-white mb-2">{book.title}</h2>
              <p className="text-gray-400 mb-4">by {book.author}</p>
              <div className="mb-4">
                <span className="text-yellow-500 text-xl font-bold">${book.price.toFixed(2)}</span>
              </div>
              
              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300">{book.description}</p>
                </div>
              )}
              
              {book.genre && (
                <p className="text-gray-400 mb-2">
                  <span className="font-semibold">Genre:</span> {book.genre}
                </p>
              )}
              
              {book.publishedDate && (
                <p className="text-gray-400 mb-2">
                  <span className="font-semibold">Published:</span> {book.publishedDate}
                </p>
              )}
              
              {book.isbn && (
                <p className="text-gray-400 mb-2">
                  <span className="font-semibold">ISBN:</span> {book.isbn}
                </p>
              )}
              
              <button
                className="mt-6 bg-yellow-600 text-black py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors"
                onClick={() => {
                  addToCart(book);
                  onClose();
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cart component
  const Cart = () => {
    return (
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-400 mt-4">Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div
                  key={item.book.id}
                  className="flex justify-between items-center mt-4"
                >
                  <div>
                    <h3 className="text-white">{item.book.title}</h3>
                    <p className="text-gray-400">
                      ${item.book.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-gray-800 text-white px-2 py-1 rounded"
                      onClick={() =>
                        updateQuantity(item.book.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="mx-2 text-white">{item.quantity}</span>
                    <button
                      className="bg-gray-800 text-white px-2 py-1 rounded"
                      onClick={() =>
                        updateQuantity(item.book.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="ml-4 text-red-500"
                      onClick={() => removeFromCart(item.book.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <p className="text-white">
                  Total: ${getTotalPrice().toFixed(2)}
                </p>
                <button 
                  className="mt-4 bg-yellow-600 text-black py-2 px-4 rounded hover:bg-yellow-500"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={() => setIsCartOpen(false)}
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 min-h-screen text-white relative">
      {/* Starry Background */}
      <div className="stars-container" ref={starsContainerRef}></div>
      
      <main className="p-4 relative z-10">
        {/* Featured Books Slider */}
        <div className="mb-16 mt-6">
          <h2 className="text-3xl font-bold text-yellow-500 mb-8 text-center">Featured Books</h2>
          
          <div className="max-w-7xl mx-auto px-4">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ 
                clickable: true,
                el: '.swiper-pagination'
              }}
              autoplay={{ 
                delay: 4000, 
                disableOnInteraction: false 
              }}
              className="featured-swiper"
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
            >
              {books.slice(0, 8).map((book) => (
                <SwiperSlide key={`featured-${book.id}`} className="py-4 px-2">
                  <div 
                    className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden cursor-pointer hover:border-yellow-600 hover:shadow-2xl transition-all h-full flex flex-col transform hover:-translate-y-2 duration-300"
                    onClick={() => openBookDetail(book)}
                  >
                    <div className="h-56 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        src={book.urlImage}
                        alt={book.title}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{book.title}</h2>
                      <p className="text-gray-400 mb-3">{book.author}</p>
                      <p className="text-yellow-500 font-bold text-lg mt-auto mb-4">
                        ${book.price.toFixed(2)}
                      </p>
                      <button
                        className="mt-auto bg-yellow-600 text-black py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors w-full font-medium"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening modal when clicking the button
                          addToCart(book);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom navigation buttons */}
            <div className="flex justify-between mt-4">
              <div className="swiper-button-prev !relative !top-0 !left-0 !mt-0 !w-10 !h-10 bg-gray-900 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors after:!text-lg"></div>
              <div className="swiper-pagination !relative !bottom-0"></div>
              <div className="swiper-button-next !relative !top-0 !right-0 !mt-0 !w-10 !h-10 bg-gray-900 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors after:!text-lg"></div>
            </div>
          </div>
          
          <div className="border-b border-gray-700 w-full my-16"></div>
        </div>

        {/* Regular book grid */}
        <div className="flex flex-wrap -mx-4">
          {currentBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        
        {totalPages > 1 && <Pagination />}
        
        <div className="text-center text-gray-400 mt-2 mb-6">
          Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, books.length)} of {books.length} books
        </div>
      </main>
      
      <Cart />
      
      <BookDetailModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={closeBookDetail} 
      />
      
    </div>
  );
}

export default BookList;