interface ITeacher {
  _id: string;
  fullname: string;
  profession: string;
  image?: string | File;
  description: string;
  previousExperience: string[];
}

export default ITeacher;
