export interface ConsultingData {
  industry: string;
  name: string;
  idea: string;
  topics: {
    formal: boolean;
    legal: boolean;
    market: boolean;
    part: boolean;
  };
  questions: Array<{
    q: string;
    a: string;
    done: boolean;
  }>;
  notes: string;
  content: {
    intro: string;
    formal: string;
    legal: string;
    market: string;
    part: string;
    next: string[];
    conclusion: string;
  };
}

export interface Consultation {
  id: number;
  name: string;
  industry: string;
  progress: number;
  status: string;
}