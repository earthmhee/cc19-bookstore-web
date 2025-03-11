
import axios from "axios";
export const getAllBooks = async (token) => {
  return await axios.get("http://localhost:8050/auth/books", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};