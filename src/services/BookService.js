// src/services/BookService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllBooks = async ({
  page = 1,
  limit = 8,
  genre = null,
  search = '',
  sortBy = 'title',
  sortOrder = 'asc'
} = {}) => {
  try {
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where = {};
    
    // Add genre filter if provided
    if (genre && genre !== 'All') {
      where.genre = genre;
    }
    
    // Add search filter if provided
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    // Get total count for pagination
    const totalCount = await prisma.books.count({ where });
    
    // Get books with publisher information
    const books = await prisma.books.findMany({
      where,
      include: {
        publisher: {
          select: {
            name: true,
            id: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });
    
    return {
      books,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    return await prisma.books.findUnique({
      where: { id: parseInt(id) },
      include: {
        publisher: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
};

export const getBookGenres = async () => {
  try {
    // Get distinct genres from the database
    const genres = await prisma.books.findMany({
      select: {
        genre: true
      },
      distinct: ['genre']
    });
    
    return genres.map(g => g.genre);
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