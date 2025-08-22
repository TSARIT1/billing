import { create } from 'zustand';
import api from '../service/api';

const useUserStore = create((set) => ({
  userData: null,
  loading: false,
  error: null,

  
  fetchUserData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/api/user/');
      set({ userData: res.data[0], loading: false });
      return res.data[0]; 
    } catch (err) {
      set({ error: "Failed to fetch user data", loading: false });
      console.error("Failed to fetch user data", err);
      throw err; 
    }
  },
  
  setUserData: (data) => set({ userData: data }),

  clearUserData: () => set({ userData: null, error: null }),
}));

export default useUserStore;