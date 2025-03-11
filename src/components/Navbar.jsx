// // src/components/Navbar.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { Book, ShoppingCart, User, LogOut } from 'lucide-react';
// import useUserStore from '../stores/userStore';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const user = useUserStore((state) => state.user);
//   const logout = useUserStore((state) => state.logout);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
  
//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
  
//   const handleLogout = () => {
//     logout();
//     setIsDropdownOpen(false);
//     navigate('/');
//   };
  
//   return (
//     <header className="bg-black border-b border-border">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         {/* Logo section - Updated to 8 Lines */}
//         <div 
//           className="flex items-center text-gold cursor-pointer" 
//           onClick={() => navigate('/')}
//         >
//           <Book className="mr-2" size={24} />
//           <span className="font-bold tracking-wider">8 LINES</span>
//         </div>
        
//         {/* Navigation links */}
//         <nav className="hidden md:flex space-x-6">
//           <span 
//             className="text-white hover:text-gold transition-colors cursor-pointer"
//             onClick={() => navigate('/')}
//           >
//             Home
//           </span>
//           <span 
//             className="text-white hover:text-gold transition-colors cursor-pointer"
//             onClick={() => navigate('/about')}
//           >
//             About
//           </span>
//           <span 
//             className="text-white hover:text-gold transition-colors cursor-pointer"
//             onClick={() => navigate('/books')}
//           >
//             Books
//           </span>
//           <span 
//             className="text-white hover:text-gold transition-colors cursor-pointer"
//             onClick={() => navigate('/reading-lists')}
//           >
//             Reading Lists
//           </span>
//           <span 
//             className="text-white hover:text-gold transition-colors cursor-pointer"
//             onClick={() => navigate('/authors')}
//           >
//             Authors
//           </span>
//         </nav>
        
//         {/* User section */}
//         <div className="flex items-center space-x-4">
//           {/* Shopping cart icon */}
//           <span 
//             className="text-white hover:text-gold transition-colors cursor-pointer"
//             onClick={() => navigate('/cart')}
//           >
//             <ShoppingCart size={20} />
//           </span>
          
//           {/* User account/login section */}
//           {user ? (
//             <div className="relative" ref={dropdownRef}>
//               <div 
//                 className="flex items-center space-x-2 cursor-pointer"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               >
//                 <User size={20} className="text-white hover:text-gold transition-colors" />
//                 <span className="text-white hover:text-gold transition-colors hidden sm:inline">
//                   {user.firstName || 'Account'}
//                 </span>
//               </div>
              
//               {/* Dropdown menu */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-dark-lighter border border-border rounded-md shadow-lg z-10">
//                   <div className="py-1">
//                     <div 
//                       className="block px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors cursor-pointer"
//                       onClick={() => {
//                         navigate('/account');
//                         setIsDropdownOpen(false);
//                       }}
//                     >
//                       My Account
//                     </div>
//                     <div 
//                       className="block px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors cursor-pointer"
//                       onClick={() => {
//                         navigate('/orders');
//                         setIsDropdownOpen(false);
//                       }}
//                     >
//                       My Orders
//                     </div>
//                     <div 
//                       className="block px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors cursor-pointer flex items-center"
//                       onClick={handleLogout}
//                     >
//                       <LogOut size={16} className="mr-2" />
//                       Logout
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <span 
//               className="text-white hover:text-gold transition-colors cursor-pointer flex items-center"
//               onClick={() => navigate('/login')}
//             >
//               <User size={20} />
//               <span className="ml-1 hidden sm:inline">Login</span>
//             </span>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Book, ShoppingCart, User, LogOut, X, Plus, Minus } from 'lucide-react';
import useUserStore from '../stores/userStore';
// ADDED: Import a new cart store
import useCartStore from '../stores/cartStore';

const Navbar = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // ADDED: Cart state from store
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };
  
  // ADDED: Get total items in cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  // ADDED: Get total price of cart
  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    );
  };
  
  // ADDED: Cart dropdown component
  const CartDropdown = () => {
    if (!isCartOpen) return null;
    
    return (
      <div 
        className="absolute right-0 mt-2 w-80 bg-dark-lighter border border-border rounded-md shadow-lg z-20 max-h-[80vh] overflow-y-auto"
        ref={cartRef}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Your Cart</h3>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsCartOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          {cart.length === 0 ? (
            <p className="text-gray-400 py-4">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.book.id} className="flex border-b border-gray-800 pb-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img 
                        src={item.book.urlImage} 
                        alt={item.book.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <h4 className="text-white text-sm font-medium">{item.book.title}</h4>
                      <p className="text-gray-400 text-xs">${item.book.price.toFixed(2)}</p>
                      <div className="flex items-center mt-1">
                        <button 
                          className="text-gray-400 hover:text-white p-1"
                          onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="mx-2 text-white text-sm">{item.quantity}</span>
                        <button 
                          className="text-gray-400 hover:text-white p-1"
                          onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <button 
                        className="text-red-500 hover:text-red-400 text-xs"
                        onClick={() => removeFromCart(item.book.id)}
                      >
                        Remove
                      </button>
                      <p className="text-gold text-sm font-medium">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-800">
                <div className="flex justify-between text-white mb-4">
                  <span>Total:</span>
                  <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="flex-1 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors text-sm"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/cart');
                    }}
                  >
                    View Cart
                  </button>
                  <button 
                    className="flex-1 bg-gold text-black py-2 px-4 rounded hover:bg-yellow-500 transition-colors text-sm"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <header className="bg-black border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo section - Updated to 8 Lines */}
        <div 
          className="flex items-center text-gold cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <Book className="mr-2" size={24} />
          <span className="font-bold tracking-wider">8 LINES</span>
        </div>
        
        {/* Navigation links */}
        <nav className="hidden md:flex space-x-6">
          <span 
            className="text-white hover:text-gold transition-colors cursor-pointer"
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <span 
            className="text-white hover:text-gold transition-colors cursor-pointer"
            onClick={() => navigate('/about')}
          >
            About
          </span>
          <span 
            className="text-white hover:text-gold transition-colors cursor-pointer"
            onClick={() => navigate('/books')}
          >
            Books
          </span>
          <span 
            className="text-white hover:text-gold transition-colors cursor-pointer"
            onClick={() => navigate('/reading-lists')}
          >
            Reading Lists
          </span>
          <span 
            className="text-white hover:text-gold transition-colors cursor-pointer"
            onClick={() => navigate('/authors')}
          >
            Authors
          </span>
        </nav>
        
        {/* User section */}
        <div className="flex items-center space-x-4">
          {/* MODIFIED: Shopping cart icon with dropdown */}
          <div className="relative">
            <span 
              className="text-white hover:text-gold transition-colors cursor-pointer relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </span>
            <CartDropdown />
          </div>
          
          {/* User account/login section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User size={20} className="text-white hover:text-gold transition-colors" />
                <span className="text-white hover:text-gold transition-colors hidden sm:inline">
                  {user.firstName || 'Account'}
                </span>
              </div>
              
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-lighter border border-border rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <div 
                      className="block px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors cursor-pointer"
                      onClick={() => {
                        navigate('/me');
                        setIsDropdownOpen(false);
                      }}
                    >
                      My Account
                    </div>
                    <div 
                      className="block px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors cursor-pointer"
                      onClick={() => {
                        navigate('/orders');
                        setIsDropdownOpen(false);
                      }}
                    >
                      My Orders
                    </div>
                    <div 
                      className="block px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors cursor-pointer flex items-center"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span 
              className="text-white hover:text-gold transition-colors cursor-pointer flex items-center"
              onClick={() => navigate('/login')}
            >
              <User size={20} />
              <span className="ml-1 hidden sm:inline">Login</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;