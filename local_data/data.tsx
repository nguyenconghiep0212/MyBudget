import { colors } from '@/theme';
import { Category, Type, ExpenseEvent, MonthlyBudget } from '@/types/budget';
import { months } from '@/utils/helper';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';

const monthlyBudget: MonthlyBudget[] = [
  {
    month: 9,
    year: 2025,
    amount: 4_000_000,
    salary: 10_000_000,
  },
];
const summaryData: ExpenseEvent[] = [
  {
    categoryId: 2,
    id: 2,
    name: 'Gas',
    description: 'Filling gas for motorcycle',
    amount: 70_000,
    date: new Date('2025-09-24'),
  },
  {
    categoryId: 1,
    id: 3,
    name: 'Takoyaki',
    description: 'yum yum',
    amount: 54_000,
    date: new Date('2025-09-24'),
  },
  {
    categoryId: 1,
    id: 1,
    name: 'Lunch',
    description: 'Lunch with friends',
    amount: 50_000,
    date: new Date('2025-04-10'),
  },
  {
    categoryId: 1,
    id: 1,
    name: 'Lunch',
    description: 'Lunch with friends',
    amount: 50_000,
    date: new Date('2025-09-20'),
  },
  {
    categoryId: 4,
    id: 1,
    name: 'Meat and Vegetables',
    description: 'For weekly groceries',
    amount: 82_000,
    date: new Date('2025-09-21'),
  },
  {
    categoryId: 4,
    id: 1,
    name: 'Meat and Vegetables',
    description: 'For weekly groceries',
    amount: 82_000,
    date: new Date('2024-03-11'),
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
function GetCategoryById(id: number): Category | undefined {
  return expenseCategory.find((i: Category) => i.id == id);
}
function monthlyGroupSummaryData(data: ExpenseEvent[]) {
  const result: any = {};

  data.forEach(item => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();

    // Helper to get categoryId
    const categoryId = item.categoryId;
    // Year
    if (!result[year]) {
      result[year] = { total: 0, data: {} };
    }
    result[year].total -= item.amount;

    // Month
    if (!result[year].data[month]) {
      result[year].data[month] = { total: 0, data: {}, categoriesId: [] };
    }
    result[year].data[month].total -= item.amount;

    // Add categoryId to month
    if (categoryId !== undefined && !result[year].data[month].categoriesId.includes(categoryId)) {
      result[year].data[month].categoriesId.push(categoryId);
    }

    // Day
    if (!result[year].data[month].data[day]) {
      result[year].data[month].data[day] = { total: 0, data: [], categoriesId: [] };
    }
    result[year].data[month].data[day].total -= item.amount;

    // Add categoryId to day
    if (categoryId !== undefined && !result[year].data[month].categoriesId.includes(categoryId)) {
      result[year].data[month].categoriesId.push(categoryId);
    }
    result[year].data[month].data[day].data.push(item);
  });
  // Convert nested objects to arrays for 'data' fields
  function convert(obj: any) {
    if (obj.data) {
      obj.data = Object.entries(obj.data).map(([key, value]) => {
        return { key, ...convert(value) };
      });
    }
    return obj;
  }

  return convert(result);
}
function groupSummaryData(data: ExpenseEvent[]) {
  const result: any = {};

  data.forEach(item => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const week = Math.ceil(date.getDate() / 7); // Week of month (simple)
    const day = date.getDate();

    // Helper to get categoryId
    const categoryId = item.categoryId;

    // Year
    if (!result[year]) {
      result[year] = { total: 0, data: {} };
    }
    result[year].total -= item.amount;

    // Month
    if (!result[year].data[month]) {
      result[year].data[month] = { total: 0, data: {}, categoriesId: [] };
    }
    result[year].data[month].total -= item.amount;

    // Add categoryId to month
    if (categoryId !== undefined && !result[year].data[month].categoriesId.includes(categoryId)) {
      result[year].data[month].categoriesId.push(categoryId);
    }

    // Week
    if (!result[year].data[month].data[week]) {
      result[year].data[month].data[week] = { total: 0, data: {}, categoriesId: [] };
    }
    result[year].data[month].data[week].total -= item.amount;

    // Add categoryId to week
    if (
      categoryId !== undefined &&
      !result[year].data[month].data[week].categoriesId.includes(categoryId)
    ) {
      result[year].data[month].data[week].categoriesId.push(categoryId);
    }

    // Day
    if (!result[year].data[month].data[week].data[day]) {
      result[year].data[month].data[week].data[day] = { total: 0, data: [], categoriesId: [] };
    }
    result[year].data[month].data[week].data[day].total -= item.amount;

    // Add categoryId to day
    if (
      categoryId !== undefined &&
      !result[year].data[month].data[week].data[day].categoriesId.includes(categoryId)
    ) {
      result[year].data[month].data[week].data[day].categoriesId.push(categoryId);
    }

    result[year].data[month].data[week].data[day].data.push(item);
  });

  // Convert nested objects to arrays for 'data' fields
  function convert(obj: any) {
    if (obj.data) {
      obj.data = Object.entries(obj.data).map(([key, value]) => {
        return { key, ...convert(value) };
      });
    }
    return obj;
  }

  return convert(result);
}
export {
  summaryData,
  expenseCategory,
  monthlyBudget,
  monthlyGroupSummaryData,
  SetMonthlyBudget,
  GetCategoryById,
  groupSummaryData,
};
