// src/pages/Orders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";

function Orders() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login", { state: { returnUrl: "/orders" } });
      return;
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8050/auth/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'PAID':
        return 'bg-green-500';
      case 'SHIPPED':
        return 'bg-blue-500';
      case 'DELIVERED':
        return 'bg-green-700';
      case 'REJECTED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 min-h-screen text-white p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 min-h-screen text-white p-8">
        <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            className="bg-yellow-600 text-black py-2 px-6 rounded-lg hover:bg-yellow-500"
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8 text-center">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-4">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <button 
              className="bg-yellow-600 text-black py-2 px-6 rounded-lg hover:bg-yellow-500"
              onClick={() => navigate("/")}
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Order #{order.id}</h2>
                    <p className="text-gray-400">Placed on {formatDate(order.orderDate)}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="bg-gray-700 text-white py-1 px-4 rounded hover:bg-gray-600 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
                  
                  <div className="space-y-4">
                    {order.OrderItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img 
                          src={item.book.urlImage} 
                          alt={item.book.title} 
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.book.title}</h4>
                          <p className="text-gray-400 text-sm">{item.book.author}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-400">${item.price.toFixed(2)} × {item.quantity}</span>
                            <span className="text-yellow-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-yellow-500 font-bold">
                      ${order.OrderItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;