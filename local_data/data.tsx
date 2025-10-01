import { colors } from '@/theme';
import { Category, Type, ExpenseEvent, MonthlyBudget } from '@/types/budget';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';

const monthlyBudget: MonthlyBudget[] = [
  {
    month: 9,
    year: 2025,
    amount: 4_000_000,
  },
];
const summaryData: ExpenseEvent[] = [
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
  { id: 0, name: 'Misc', icon: <FontAwesome name="list" size={24} color={colors.Negative} /> },
  { id: 1, name: 'Food', icon: <Ionicons name="fast-food" size={24} color={colors.Negative} /> },
  {
    id: 2,
    name: 'Gas',
    icon: <MaterialIcons name="local-gas-station" size={24} color={colors.Negative} />,
  },
  { id: 3, name: 'Game', icon: <FontAwesome name="gamepad" size={24} color={colors.Negative} /> },
  {
    id: 4,
    name: 'Grocery',
    icon: <FontAwesome name="shopping-basket" size={24} color={colors.Negative} />,
  },
];
const IncomeCategory: Category[] = [
  { id: 0, name: 'Salary', icon: <FontAwesome name="money" size={24} color={colors.Positive} /> },
];
const type: Type[] = [
  { id: 1, name: 'Expense' },
  { id: 2, name: 'Income' },
];

function SetMonthlyBudget(newBudget: MonthlyBudget) {
  if (
    monthlyBudget.find(i => i.month == newBudget.month && i.year == newBudget.year) == undefined
  ) {
    monthlyBudget.unshift(newBudget);
  } else {
    monthlyBudget.forEach(item => {
      if (newBudget.month == item.month && newBudget.year == item.year) {
        item.amount = newBudget.amount;
      }
    });
  }
  console.log('Update existing budget' + JSON.stringify(monthlyBudget));
}
function GetCategoryById(id: number, isExpense: boolean): Category | undefined {
  if (isExpense) {
    return expenseCategory.find((i: Category) => i.id == id);
  } else {
    return IncomeCategory.find((i: Category) => i.id == id);
  }
}
export {
  summaryData,
  expenseCategory,
  IncomeCategory,
  type,
  monthlyBudget,
  SetMonthlyBudget,
  GetCategoryById,
};
