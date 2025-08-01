interface ICertification {
  _id: string;
  student: {
    _id: string;
    fullName: string;
  };
  course: {
    _id: string;
    title: string;
    teacher: {
      fullname: string;
    }
  };
  created_at: string;
}

export default ICertification;
