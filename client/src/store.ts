import { create } from "zustand";
import IUserStore from "./interfaces/IUserStore";
import IUser from "./interfaces/IUser";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

const getUserFromLocalStorage = (): IUser | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const useUserStore = create<IUserStore>((set) => ({
  user: getUserFromLocalStorage(),
  token: localStorage.getItem("token") || null,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  clearUser: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));

// Check if the token is valid when the app is initialized
export const checkUserFromCookie = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    useUserStore.getState().clearUser();
    return;
  }

  try {
    const response = await axios.get(`${backend}/user/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Sending token in header
      },
    });
    useUserStore.getState().setUser(response.data.payload); // Set user to store if valid
  } catch (error) {
    console.log("User not authenticated or token expired", error);
    useUserStore.getState().clearUser(); // Clear the user and token if invalid
  }
};
