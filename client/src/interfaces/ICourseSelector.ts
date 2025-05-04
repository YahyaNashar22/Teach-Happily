interface ICourseSelector {
  category: string;
  priceType: string;
  page: number;
  digital?: boolean;
  setTotalPages: (pages: number) => void;
}

export default ICourseSelector;
