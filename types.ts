export enum ReasonType {
  CARELESS = '粗心大意',
  CONCEPT_UNCLEAR = '概念模糊',
  HARD_QUESTION = '难度过高',
  CALCULATION_ERROR = '计算错误',
  OUT_OF_SYLLABUS = '超纲内容',
  OTHER = '其他原因'
}

export interface Mistake {
  id: string;
  title: string;
  subject: string;
  reason: ReasonType;
  difficulty: number; // 1-5
  solution: string;
  imageUrl?: string;
  isMastered: boolean;
  createdAt: number;
}

export type ViewType = 'list' | 'add' | 'stats' | 'review';

export interface FilterOptions {
  search: string;
  subject: string;
  mastery: 'all' | 'unmastered' | 'mastered';
}