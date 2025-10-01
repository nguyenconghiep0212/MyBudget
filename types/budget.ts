import { ReactNode } from 'react';

export interface ExpenseEvent {
  typeId: number;
  expenseCategoryId?: number;
  incomeCategoryId?: number;
  id: number;
  name: string;
  description?: string;
  amount: number;
  date: Date;
}

export interface Type {
  id: number;
  name: string;
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
}
