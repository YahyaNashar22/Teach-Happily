import ICategory from "./ICategory";
import ITeacher from "./ITeacher";

interface IProduct {
  _id: string;
  image: string | File;
  title: string;
  product: string | File;
  description: string;
  teacher: ITeacher;
  category: ICategory;
  price: number;
  students: string[];
  createdAt: string;
  slug: string;
}

export default IProduct;
