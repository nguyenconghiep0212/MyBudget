import { ReactNode } from 'react';

export interface BudgetEvent {
  categoryId: number;
  id: string;
  name: string;
  description?: string;
  amount: number;
  date: Date;
}
export interface MonthlyBudget {
  month: number;
  year: number;
  amount: number;
  salary: number;
}

export interface Category {
  id: number;
  name: string;
  icon?: ReactNode;
}
