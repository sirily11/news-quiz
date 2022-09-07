export interface Quiz {
  choices?: Choice[];
  explanation?: string;
  hint?: string;
  title: string;
  type: Type;
  textAnswer?: string;
}

export interface Choice {
  correct: boolean;
  title: string;
  checked?: boolean;
}

export enum Type {
  Multiselect = "multiselect",
  Select = "select",
  Text = "text",
}
