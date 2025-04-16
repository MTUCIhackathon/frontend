export interface Question {
    order: number;
    question: string;
  }
  
export interface Test {
    id: string;
    name: string;
    description: string;
    questions: Question[];
  }
  