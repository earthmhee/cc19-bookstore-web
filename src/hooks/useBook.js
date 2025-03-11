// src/hooks/useBooks.js
import { useState, useEffect } from 'react';
import { getAllBooks, getBookById, getBookGenres } from '../services/BookService';

export const useBooks = (initialParams = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    pages: 0
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 8,
    genre: null,
    search: '',
    sortBy: 'title',
    sortOrder: 'asc',
    ...initialParams
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const result = await getAllBooks(params);
        setBooks(result.books);
        setPagination(result.pagination);
        setError(null);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [params]);

  const updateParams = (newParams) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when filters change
      page: newParams.page || (newParams.genre || newParams.search ? 1 : prev.page)
    }));
  };

  return {
    books,
    loading,
    error,
    pagination,
    params,
    updateParams
  };
};

export const useBook = (id) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const result = await getBookById(id);
        setBook(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
};

export const useGenres = () => {
  const [genres, setGenres] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const genreList = await getBookGenres();
        setGenres(['All', ...genreList]);
        setError(null);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading, error };
};

export default useBooks;