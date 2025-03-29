// src/components/Admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/admin/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(
        `http://localhost:8000/admin/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading orders...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Order #{order.id}</h3>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="border p-2 rounded"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Customer: {order.user.username}</p>
                <p className="text-gray-600">Email: {order.user.email}</p>
                <p className="text-gray-600">
                  Date: {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Status: <span className={`font-bold ${
                    order.status === 'PAID' ? 'text-green-600' :
                    order.status === 'REJECTED' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>{order.status}</span>
                </p>
              </div>
              {order.receiptUrl && (
                <div>
                  <p className="font-bold mb-2">Receipt:</p>
                  <img
                    src={order.receiptUrl}
                    alt="Receipt"
                    className="max-w-xs rounded shadow"
                  />
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-bold mb-2">Order Items:</h4>
              <div className="space-y-2">
                {order.OrderItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.book.title}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <p className="text-right font-bold">
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
    </div>
  );
};