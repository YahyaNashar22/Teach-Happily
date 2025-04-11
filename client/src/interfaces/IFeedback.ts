import IUser from "./IUser";

interface IFeedback {
  _id: string;
  userId: IUser;
  courseId: string;
  content: string;
  rating?: number;
  createdAt: string;
}

export default IFeedback;
