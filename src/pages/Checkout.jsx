// src/pages/Checkout.jsx
import React, { useState, useRef } from "react"; // Added useRef
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import useCartStore from "../stores/cartStore";

function Checkout() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const cart = useCartStore((state) => state.cart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  
  // Add a ref for the file input
  const fileInputRef = useRef(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: ""
  });
  
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentReceipt(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add a function to handle the file selection button click
  const handleSelectFileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentReceipt) {
      alert("Please upload a payment receipt");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("receipt", paymentReceipt);
      
      // Add order details
      formData.append("shippingInfo", JSON.stringify(shippingInfo));
      
      // Format cart items for the backend
      const items = cart.map(item => ({
        bookId: item.book.id,
        quantity: item.quantity,
        price: item.book.price
      }));
      
      formData.append("items", JSON.stringify(items));
      
      // Send the order to the backend
      const response = await fetch("http://localhost:8050/auth/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOrderComplete(true);
        setOrderId(data.orderId);
        clearCart(); // Clear the cart after successful order
      } else {
        throw new Error(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not logged in, redirect to login
  if (!user) {
    return (
      <div className="bg-gray-800 min-h-screen text-white p-8">
        <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Please Login</h2>
          <p className="text-gray-300 mb-6">You need to be logged in to checkout.</p>
          <button 
            className="bg-yellow-600 text-black py-2 px-6 rounded-lg hover:bg-yellow-500"
            onClick={() => navigate("/login", { state: { returnUrl: "/checkout" } })}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If cart is empty, show message
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="bg-gray-800 min-h-screen text-white p-8">
        <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-300 mb-6">Add some books to your cart before checking out.</p>
          <button 
            className="bg-yellow-600 text-black py-2 px-6 rounded-lg hover:bg-yellow-500"
            onClick={() => navigate("/")}
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  // Order complete screen
  if (orderComplete) {
    return (
      <div className="bg-gray-800 min-h-screen text-white p-8">
        <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg">
          <div className="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold text-yellow-500">Order Placed Successfully!</h2>
            <p className="text-gray-300 mt-2">Order ID: {orderId}</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Our team will verify your payment receipt</li>
              <li>Once verified, your order will be processed</li>
              <li>You'll receive an email with shipping details</li>
              <li>Your books will be on their way to you!</li>
            </ol>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button 
              className="bg-gray-700 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
              onClick={() => navigate("/orders")}
            >
              View My Orders
            </button>
            <button 
              className="bg-yellow-600 text-black py-2 px-6 rounded-lg hover:bg-yellow-500"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8 text-center">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Form */}
          <div className="lg:w-2/3 bg-gray-900 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-6">Payment Receipt</h2>
                <p className="text-gray-400 mb-4">
                  Please make a payment to our account and upload the receipt below:
                </p>
                
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-yellow-500 mb-2">Payment Details</h3>
                  <p className="text-gray-300">Bank: Example Bank</p>
                  <p className="text-gray-300">Account Number: 1234567890</p>
                  <p className="text-gray-300">Account Name: 8 Lines Bookstore</p>
                  <p className="text-gray-300">Amount: ${getTotalPrice().toFixed(2)}</p>
                </div>
                
                {/* Fixed file upload section */}
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                  {receiptPreview ? (
                    <div className="mb-4">
                      <img 
                        src={receiptPreview} 
                        alt="Receipt preview" 
                        className="max-h-48 mx-auto"
                      />
                      <button 
                        type="button"
                        className="mt-4 text-red-400 hover:text-red-300"
                        onClick={(e) => {
                          e.preventDefault();
                          setPaymentReceipt(null);
                          setReceiptPreview(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-400 mb-4">Upload your payment receipt</p>
                      
                      <button
                        type="button"
                        onClick={handleSelectFileClick}
                        className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 cursor-pointer"
                      >
                        Select File
                      </button>
                    </>
                  )}
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="receipt"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-600 text-black py-3 px-6 rounded-lg hover:bg-yellow-500 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3 bg-gray-900 p-6 rounded-xl shadow-lg h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.book.id} className="flex items-center space-x-4">
                  <img 
                    src={item.book.urlImage} 
                    alt={item.book.title} 
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.book.title}</h3>
                    <p className="text-gray-400 text-sm">{item.book.author}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-400">${item.book.price.toFixed(2)} × {item.quantity}</span>
                      <span className="text-yellow-500 font-medium">${(item.book.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-700 pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span className="text-white">Total</span>
                <span className="text-yellow-500">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 mt-4"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;