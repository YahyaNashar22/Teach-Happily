import ICourse from "./ICourse";

interface IUser {
  _id: string;
  fullName: string;
  role: string;
  email?: string;
  wishlist: ICourse[];
}

export default IUser;
