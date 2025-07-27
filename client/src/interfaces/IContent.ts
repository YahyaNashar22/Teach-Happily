interface IQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface IQuiz {
  questions: IQuizQuestion[];
}

interface IContent {
  title: string;
  url: string | File;
  quiz?: IQuiz;
}

export type { IQuiz, IQuizQuestion };
export default IContent;
