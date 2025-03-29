// src/services/BookService.js
import axios from 'axios';

const API_URL = 'http://localhost:8050/auth'; // Your backend URL

export const getAllBooks = async ({
  page = 1,
  limit = 8,
  genre = null,
  search = '',
  sortBy = 'title',
  sortOrder = 'asc'
} = {}) => {
  try {
    const response = await axios.get(`${API_URL}/books`, {
      params: {
        page,
        limit,
        genre,
        search,
        sortBy,
        sortOrder
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/books/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
};

export const getBookGenres = async () => {
  try {
    const response = await axios.get(`${API_URL}/books/genres`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching book genres:', error);
    throw error;
  }
};

export default {
  getAllBooks,
  getBookById,
  getBookGenres
};