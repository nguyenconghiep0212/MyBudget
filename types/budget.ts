import { ReactNode } from 'react';

export interface BudgetEvent {
  categoryId: number;
  id: number;
  name: string;
  description?: string;
  amount: number;
  date: Date;
}

export interface Category {
  id: number;
  name: string;
  icon?: ReactNode;
}
export interface MonthlyBudget {
  month: number;
  year: number;
  amount: number;
  salary: number;
}
