interface ICourseSelector {
    category: string;
    priceType: string;
    page: number;
    setTotalPages: (pages: number) => void;
  }
  

  export default ICourseSelector;