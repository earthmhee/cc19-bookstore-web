// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import axios from "axios";
// import { toast } from "react-toastify";

// const useUserStore = create(
//   persist((set, get) => ({
//     user: null,
//     token: null,
//     role: null,
//     login: async (input) => {
//       const rs = await axios.post("http://localhost:8050/auth/login", input);
//       set({ user: rs.data.user, token: rs.data.token ,role: rs.data.role});
//       toast.success("Login success");
//       return rs.data;
//     },
//     updateUser: (updatedData) => set((state) => ({
//       user: { ...state.user, ...updatedData }
//     })),
//     logout: () => set({token : '', user: null})
// }), {
// 	name: 'state',
// 	storage: createJSONStorage( ()=> localStorage )
// }))

// export default useUserStore;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify
import { getUserInfo } from '../api/user';

const useUserStore = create(
  persist((set, get) => ({
    user: null,
    token: null,
    role: null,
    
    login: async (input) => {
      try {
        const rs = await axios.post("http://localhost:8050/auth/login", input);
        set({ 
          user: rs.data.user, 
          token: rs.data.token, 
          role: rs.data.role 
        });
        toast.success("Login success");
        return rs.data;
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.response?.data?.message || "Login failed");
        throw error;
      }
    },
    
    updateUser: (updatedData) => {
      // Log before update
      console.log("Current user state:", get().user);
      console.log("Updating with:", updatedData);
      
      set((state) => ({
        // Keep all existing state properties
        ...state,
        // Update only the user object
        user: { 
          ...state.user, 
          ...updatedData 
        }
      }));
      
      // Log after update to verify
      console.log("Updated user state:", get().user);
      
      // Show success toast
      toast.success("Profile updated successfully");
    },
    
    logout: () => set({ token: '', user: null, role: null }),
    
    // Add a method to get the current user data
    getUserInfo :async (token) => {
      try {
         return await axios.get("http://localhost:8050/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.log(error);
      }  
    },
    
    // Add a method to refresh user data from API
    refreshUser: async (token) => {
      if (!token) return;
      
      try {
        const response = await axios.get("http://localhost:8050/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        
        set((state) => ({
          ...state,
          user: response.data
        }));
        
        return response.data;
      } catch (error) {
        console.error("Error refreshing user data:", error);
        // Don't throw error here to prevent app crashes
      }
    }
  }), {
    name: 'state',
    storage: createJSONStorage(() => localStorage),
    // Only persist these fields
    partialize: (state) => ({ 
      user: state.user, 
      token: state.token, 
      role: state.role 
    }),
  })
);

export default useUserStore;
