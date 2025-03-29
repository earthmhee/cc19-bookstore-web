// src/components/Admin/BookManagement.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8050/admin/books', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key][0]) {
        formData.append(key, data[key][0]);
      } else if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    try {
      if (editingBook) {
        await axios.patch(`http://localhost:8050/admin/books/${editingBook.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://localhost:8050/admin/books', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      reset();
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    Object.keys(book).forEach(key => {
      if (key !== 'image') {
        setValue(key, book[key]);
      }
    });
  };

  const handleAdjustStock = async (bookId, newStock) => {
    try {
      await axios.patch(`http://localhost:8050/admin/books/${bookId}/stock`, 
        { stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchBooks();
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {editingBook ? 'Edit Book' : 'Add New Book'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <input {...register('title')} placeholder="Book Title" className="w-full p-2 border rounded" />
        <input {...register('author')} placeholder="Author" className="w-full p-2 border rounded" />
        <textarea {...register('description')} placeholder="Description" className="w-full p-2 border rounded" />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" {...register('stock')} placeholder="Stock" className="w-full p-2 border rounded" />
          <input type="number" step="0.01" {...register('price')} placeholder="Price" className="w-full p-2 border rounded" />
        </div>
        <input {...register('genre')} placeholder="Genre" className="w-full p-2 border rounded" />
        <input type="file" {...register('image')} className="w-full p-2 border rounded" />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
          {editingBook && (
            <button
              type="button"
              onClick={() => {
                setEditingBook(null);
                reset();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <div key={book.id} className="border p-4 rounded shadow">
            {book.urlImage && (
              <img src={book.urlImage} alt={book.title} className="w-full h-48 object-cover mb-2 rounded" />
            )}
            <h3 className="font-bold text-lg">{book.title}</h3>
            <p className="text-gray-600">Author: {book.author}</p>
            <p className="text-gray-600">Genre: {book.genre}</p>
            <p className="text-gray-600">Stock: {book.stock}</p>
            <p className="text-gray-600">Price: ${book.price}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(book)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <div className="flex items-center gap-2">
                <label className="text-sm">Stock:</label>
                <input
                  type="number"
                  defaultValue={book.stock}
                  onChange={(e) => handleAdjustStock(book.id, e.target.value)}
                  className="w-20 p-1 border rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};