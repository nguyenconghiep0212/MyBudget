import { colors } from '@/theme';
import { Category, BudgetEvent, MonthlyBudget } from '@/types/budget';
import { GetToday, months } from '@/utils/helper';
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

const monthlyBudget: MonthlyBudget[] = [
  {
    month: 10,
    year: 2025,
    amount: 5_250_000,
    salary: 12_500_000,
  },
  {
    month: 9,
    year: 2025,
    amount: 4_000_000,
    salary: 12_000_000,
  },
  {
    month: 3,
    year: 2024,
    amount: 6_550_000,
    salary: 8_000_000,
  },
];
const budgetEvent: BudgetEvent[] = [
  {
    categoryId: 2,
    id: '412',
    name: 'Gas',
    description: 'Filling gas for motorcycle',
    amount: 65_000,
    date: new Date('2025-10-04'),
  },
  {
    categoryId: 2,
    id: '2',
    name: 'Gas',
    description: 'Filling gas for motorcycle',
    amount: 70_000,
    date: new Date('2025-09-24'),
  },
  {
    categoryId: 1,
    id: '3',
    name: 'Takoyaki',
    description: 'yum yum',
    amount: 54_000,
    date: new Date('2025-09-24'),
  },
  {
    categoryId: 4,
    id: '41',
    name: 'Meat and Vegetables',
    description: 'For weekly groceries',
    amount: 82_000,
    date: new Date('2025-09-21'),
  },
  {
    categoryId: 1,
    id: '21',
    name: 'Lunch',
    description: 'Lunch with friends',
    amount: 50_000,
    date: new Date('2025-09-20'),
  },
  {
    categoryId: 1,
    id: '11',
    name: 'Lunch',
    description: 'Lunch with friends',
    amount: 50_000,
    date: new Date('2025-04-10'),
  },
  {
    categoryId: 4,
    id: '32',
    name: 'Meat and Vegetables',
    description: 'For weekly groceries',
    amount: 1_082_000,
    date: new Date('2024-03-11'),
  },
  {
    categoryId: 4,
    id: '132',
    name: 'Stuffs',
    description: 'Groceries',
    amount: 2_610_000,
    date: new Date('2024-03-22'),
  },
];
const expenseCategory: Category[] = [
  { id: 0, name: 'Misc', icon: <FontAwesome name="list" size={24} color={colors.Negative} /> },
  { id: 1, name: 'Food', icon: <Ionicons name="fast-food" size={24} color={colors.Negative} /> },
  {
    id: 2,
    name: 'Vehicle',
    icon: <MaterialCommunityIcons name="motorbike" size={24} color={colors.Negative} />,
  },
  {
    id: 3,
    name: 'Game',
    icon: <Ionicons name="game-controller" size={24} color={colors.Negative} />,
  },
  {
    id: 4,
    name: 'Grocery',
    icon: <FontAwesome name="shopping-cart" size={24} color={colors.Negative} />,
  },
  {
    id: 5,
    name: 'Pet',
    icon: <MaterialIcons name="pets" size={24} color={colors.Negative} />,
  },
  {
    id: 6,
    name: 'Vacation',
    icon: <Ionicons name="earth-sharp" size={24} color={colors.Negative} />,
  },
  {
    id: 7,
    name: 'Healthcare',
    icon: <FontAwesome6 name="pills" size={24} color={colors.Negative} />,
  },
  {
    id: 8,
    name: 'Work',
    icon: <MaterialIcons name="work" size={24} color={colors.Negative} />,
  },
  {
    id: 9,
    name: 'Family',
    icon: <MaterialIcons name="family-restroom" size={24} color={colors.Negative} />,
  },
];
function AddExpense(newExpense: BudgetEvent) {
  budgetEvent.unshift(newExpense);
  console.log('Add: ' + JSON.stringify(budgetEvent));
}
function EditExpense(expense: BudgetEvent) {
  budgetEvent.forEach(item => {
    if (item.id === expense.id) {
      Object.assign(item, expense);
      console.log('Edit: ' + JSON.stringify(item));
    }
  });
}
function DeleteExpense(expenseId: string) {
  const index = budgetEvent.findIndex(item => item.id === expenseId);
  budgetEvent.splice(index, 1);
  console.log('Remove: ' + JSON.stringify(budgetEvent));
}
function GetAvailableYear(): number[] {
  const years: number[] = [];
  if (budgetEvent.length === 0) {
    years.push(GetToday().getFullYear());
    return years;
  }
  budgetEvent.forEach((item: BudgetEvent, index: number) => {
    if (!years.includes(item.date.getFullYear())) {
      years.unshift(item.date.getFullYear());
    }
  });
  years.push(years[years.length - 1] + 1);
  return years;
}
function GetMonthlyBudget(year: number) {
  const result: any[] = [];
  for (let month = 1; month <= 12; month++) {
    result.push({
      month: month,
      categories: [],
      expense: 0,
      budget: 0,
      salary: 0,
    });
  }
  monthlyBudget.forEach((item, index) => {
    if (item.year === year) {
      const temp = result.find(resItem => resItem.month === item.month);
      if (temp) {
        temp.salary = item.salary;
        temp.budget = item.amount;
      }
    }
  });
  budgetEvent.forEach(item => {
    if (item.date.getFullYear() === year) {
      const temp = result.find(resItem => resItem.month === item.date.getMonth() + 1);
      if (temp) {
        temp.expense += item.amount;
        if (!temp.categories.includes(item.categoryId)) {
          temp.categories.push(item.categoryId);
        }
      }
    }
  });
  return result;
}
function SetMonthlyBudget(newBudget: MonthlyBudget) {
  if (
    monthlyBudget.find(i => i.month === newBudget.month && i.year === newBudget.year) === undefined
  ) {
    monthlyBudget.unshift(newBudget);
  } else {
    monthlyBudget.forEach(item => {
      if (newBudget.month === item.month && newBudget.year === item.year) {
        item.amount = newBudget.amount;
        item.salary = newBudget.salary;
      }
    });
  }
}
function GetCategoryById(id: number): Category | undefined {
  return expenseCategory.find((i: Category) => i.id === id);
}
function groupBudgetDataFlat() {
  const result: any = {};

  budgetEvent.forEach(item => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
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
  return result;
}
function groupBudgetDataTree() {
  const result: any = {};

  budgetEvent.forEach(item => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
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

  return result;
}
export {
  budgetEvent,
  expenseCategory,
  monthlyBudget,
  AddExpense,
  EditExpense,
  DeleteExpense,
  GetAvailableYear,
  GetMonthlyBudget,
  SetMonthlyBudget,
  GetCategoryById,
  groupBudgetDataFlat,
  groupBudgetDataTree,
};
