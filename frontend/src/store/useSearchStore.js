import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
  results: [],
  searchLoading: false,
  oneUser:null,
  searchById: async (userId) => {
    set({ searchLoading: true });
    const res = await axiosInstance.get(`/search/one-users/${userId}`);
    set({ oneUser: res.data.result });
    set({ searchLoading: false });
  },
  searchForUsers: async (userName) => {
    set({ searchLoading: true });
    const res = await axiosInstance.get(`/search/users/${userName}`);
    set({ results: res.data.results });
    set({ searchLoading: false });
  },
}));
