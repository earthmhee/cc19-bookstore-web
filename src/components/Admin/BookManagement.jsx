import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useUserStore from '../../stores/userStore';

export const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [page, setPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true); // Track if there are more books to fetch
  const observer = useRef(); // Ref for the infinite scroll observer
  const { register, handleSubmit, reset, setValue } = useForm();
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const fetchBooks = async (page) => {
    try {
      setLoading(true);
      console.log('Fetching page:', page);

      // Simulate a delay of 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await axios.get(`http://localhost:8050/admin/books?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newBooks = response.data.books;

      setBooks((prevBooks) => [...prevBooks, ...newBooks]); // Append new books to the existing list
      setHasMore(newBooks.length > 0); // If no new books, stop fetching
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const lastBookRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1); // Load the next page
      }
    });

    if (node) observer.current.observe(node);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:8050/admin/books', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      reset();
      setEditingBook(null);
      setPage(1); // Reset to the first page
      setBooks([]); // Clear the book list
      fetchBooks(1); // Fetch the first page again
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    Object.keys(book).forEach((key) => {
      if (key !== 'image') {
        setValue(key, book[key]);
      }
    });
  };

  const handleAdjustStock = async (bookId, newStock) => {
    try {
      await axios.patch(
        `http://localhost:8050/admin/books/${bookId}/stock`,
        { stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPage(1); // Reset to the first page
      setBooks([]); // Clear the book list
      fetchBooks(1); // Fetch the first page again
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">
        {editingBook ? 'Edit Book' : 'Add New Book'}
      </h2>
  
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 mb-8 bg-gray-800 text-white p-6 rounded shadow-lg"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Book Title</label>
          <input
            {...register('title')}
            placeholder="Enter the book title"
            className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            {...register('author')}
            placeholder="Enter the author's name"
            className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            placeholder="Enter a brief description of the book"
            className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              {...register('stock')}
              placeholder="Enter the stock quantity"
              className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              {...register('price')}
              placeholder="Enter the price"
              className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <input
            {...register('genre')}
            placeholder="Enter the genre"
            className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Book Cover Image</label>
          <input
            type="file"
            {...register('image')}
            className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
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
        {books.map((book, index) => (
          <div
            key={`${book.id}-${index}`} // Combine the book ID and index to ensure uniqueness
            ref={index === books.length - 1 ? lastBookRef : null} // Attach ref to the last book
            className="border p-4 rounded shadow bg-gray-800 text-white"
          >
            {book.urlImage && (
              <img
                src={book.urlImage}
                alt={book.title}
                className="w-full h-48 object-cover mb-2 rounded"
              />
            )}
            <h3 className="font-bold text-lg">{book.title}</h3>
            <p className="text-gray-300">Author: {book.author}</p>
            <p className="text-gray-300">Genre: {book.genre}</p>
            <p className="text-gray-300">Stock: {book.stock}</p>
            <p className="text-gray-300">Price: ${book.price}</p>
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
                  className="w-20 p-1 border rounded text-black"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center text-gray-500 mt-4">Loading more books...</div>}
    </div>
  );}