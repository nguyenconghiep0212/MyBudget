import { Category, Type, Budget, MonthlyBudget } from '@/types/budget';

const monthlyBudget: MonthlyBudget[] = [
  {
    month: 9,
    year: 2025,
    amount: 4_000_000,
  },
];
const summaryData: Budget[] = [
  {
    typeId: 1,
    expenseCategoryId: 2,
    id: 2,
    name: 'Gas',
    description: 'Filling gas for motorcycle',
    amount: 70_000,
    date: new Date('2025-09-24'),
  },
  {
    typeId: 1,
    expenseCategoryId: 1,
    id: 3,
    name: 'Takoyaki',
    description: 'yum yum',
    amount: 54_000,
    date: new Date('2025-09-24'),
  },
  {
    typeId: 1,
    expenseCategoryId: 1,
    id: 1,
    name: 'Lunch',
    description: 'Lunch with friends',
    amount: 50_000,
    date: new Date('2025-09-20'),
  },
  {
    typeId: 1,
    expenseCategoryId: 4,
    id: 1,
    name: 'Meat and Vegetables',
    description: 'For weekly groceries',
    amount: 82_000,
    date: new Date('2025-09-21'),
  },
  {
    typeId: 2,
    incomeCategoryId: 0,
    id: 0,
    name: 'Salary',
    description: 'yay!!',
    amount: 10_000_000,
    date: new Date('2025-09-10'),
  },
];
const expenseCategory: Category[] = [
  { id: 0, name: 'Misc' },
  { id: 1, name: 'Food' },
  { id: 2, name: 'Vehicle' },
  { id: 3, name: 'Game' },
  { id: 4, name: 'Grocery' },
];
const IncomeCategory: Category[] = [{ id: 0, name: 'Salary' }];
const type: Type[] = [
  { id: 1, name: 'Expense' },
  { id: 2, name: 'Income' },
];
export { summaryData, expenseCategory, IncomeCategory, type, monthlyBudget };
