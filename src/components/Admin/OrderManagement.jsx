import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useUserStore from '../../stores/userStore';

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Track if there are more orders to fetch
  const observer = useRef(); // Ref for the infinite scroll observer

  const token = useUserStore((state) => state.token);

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      console.log('Fetching page:', page);

      // Simulate a delay of 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await axios.get(`http://localhost:8050/admin/orders?page=${page}&limit=3`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newOrders = response.data.orders;

      setOrders((prevOrders) => [...prevOrders, ...newOrders]); // Append new orders to the existing list
      setHasMore(newOrders.length > 0); // If no new orders, stop fetching
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const lastOrderRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1); // Load the next page
      }
    });

    if (node) observer.current.observe(node);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(
        `http://localhost:8050/admin/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={order.id}
            ref={index === orders.length - 1 ? lastOrderRef : null} // Attach ref to the last order
            className="border border-gray-700 p-6 rounded-lg shadow-lg bg-gray-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="border border-gray-600 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING" className="text-yellow-500">Pending</option>
                <option value="PAID" className="text-green-500">Paid</option>
                <option value="REJECTED" className="text-red-500">Rejected</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400">Customer: {order.user.username}</p>
                <p className="text-gray-400">Email: {order.user.email}</p>
                <p className="text-gray-400">
                  Date: {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="text-gray-400">
                  Status: <span className={`font-bold ${
                    order.status === 'PAID' ? 'text-green-500' :
                    order.status === 'REJECTED' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>{order.status}</span>
                </p>
              </div>
              {order.receiptUrl && (
                <div>
                  <p className="font-bold text-gray-300 mb-2">Receipt:</p>
                  <img
                    src={order.receiptUrl}
                    alt="Receipt"
                    className="max-w-xs rounded shadow"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h4 className="font-bold text-gray-300 mb-2">Order Items:</h4>
              <div className="space-y-2">
                {order.OrderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">{item.book.title}</p>
                      <p className="text-sm text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-white">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 mt-4 pt-4">
                <p className="text-right font-bold text-white">
                  Total: $
                  {order.OrderItems.reduce(
                    (sum, item) => sum + item.quantity * item.price,
                    0
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center text-gray-500 mt-4">Loading more orders...</div>}
    </div>
  );
};