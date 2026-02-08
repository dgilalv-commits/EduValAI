
export enum InstrumentType {
  RUBRICA = 'rubrica',
  LISTA_COTEJO = 'lista-cotejo',
  ESCALA = 'escala',
  GUIA_OBSERVACION = 'guia-observacion',
  EXAMEN = 'examen'
}

export interface RubricLevel {
  score: number;
  description: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  levels: Record<number, string>;
  selectedLevel?: number;
}

export interface RubricData {
  title: string;
  subject: string;
  description: string;
  level: string;
  criteria: RubricCriterion[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked?: boolean;
}

export interface ChecklistData {
  title: string;
  subject: string;
  level: string;
  items: ChecklistItem[];
}

export interface Question {
  id: string;
  text: string;
  type: 'opcion-multiple' | 'verdadero-falso' | 'desarrollo';
  points: number;
  obtainedPoints?: number;
}

export interface ExamData {
  title: string;
  subject: string;
  instructions: string;
  questions: Question[];
}

export type InstrumentData = RubricData | ChecklistData | ExamData | any;
