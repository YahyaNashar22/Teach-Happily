import IUser from "./IUser";

interface IUserStore {
  user: IUser | null;
  token: string | null;
  setUser: (user: IUser) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
}

export default IUserStore;
