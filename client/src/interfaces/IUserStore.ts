import IUser from "./IUser";

interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}

export default IUserStore;
