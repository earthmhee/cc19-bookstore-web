// src/pages/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../stores/cartStore";

function Cart() {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  if (cart.length === 0) {
    return (
      <div className="bg-gray-800 min-h-screen text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-500 mb-8 text-center">Your Cart</h1>
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-gray-400 mb-6">Add some books to your cart to get started.</p>
            <button 
              className="bg-yellow-600 text-black py-2 px-6 rounded-lg hover:bg-yellow-500"
              onClick={() => navigate("/")}
            >
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8 text-center">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Cart Items ({cart.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-800">
                {cart.map((item) => (
                  <div key={item.book.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img 
                      src={item.book.urlImage} 
                      alt={item.book.title} 
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white">{item.book.title}</h3>
                      <p className="text-gray-400">{item.book.author}</p>
                      <p className="text-yellow-500 font-bold mt-1">${item.book.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center border border-gray-700 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.book.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-gray-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.book.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                      
                      <p className="text-yellow-500 font-bold mt-2">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="border-t border-gray-800 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-500">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-yellow-600 text-black py-3 px-6 rounded-lg hover:bg-yellow-500 font-bold text-lg mb-4"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;