import { create } from "zustand";
import IUserStore from "./interfaces/IUserStore";
import IUser from "./interfaces/IUser";

const getUserFromLocalStorage = (): IUser | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const useUserStore = create<IUserStore>((set) => ({
  user: getUserFromLocalStorage(),
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));
