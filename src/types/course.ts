export interface Resource {
  title: string;
  url: string;
  type: "article" | "video" | "docs" | "github";
}

export interface CodeSnippet {
  language: string;
  code: string;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export interface SubmoduleOutline {
  id: string;
  title: string;
  description: string;
}

export interface SubmoduleContent {
  content: string;
  codeSnippets: CodeSnippet[];
  resources: Resource[];
  questions: QuizQuestion[];
}

export interface ModuleOutline {
  id: string;
  title: string;
  description: string;
  submodules: SubmoduleOutline[];
}

export interface CourseData {
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  modules: ModuleOutline[];
}
