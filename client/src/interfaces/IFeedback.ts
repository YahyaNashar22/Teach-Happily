import IUser from "./IUser";

interface IFeedback {
  _id: string;
  userId: IUser;
  content: string;
  rating?: number;
  createdAt: string;
}

export default IFeedback;
