import axios from "axios";

export const getUserInfo = async (token) => {
  return await axios.get("http://localhost:8050/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserInfo = async (token, formData) => {
  return await axios.patch("http://localhost:8050/auth/update-profile", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
