import { colors } from '@/theme';
import { Category, BudgetEvent, MonthlyBudget } from '@/types/budget';
import { months } from '@/utils/helper';
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const monthlyBudget: MonthlyBudget[] = [
  {
    month: 9,
    year: 2025,
    amount: 4_000_000,
    salary: 10_000_000,
  },
];
const budgetEvent: BudgetEvent[] = [
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
    icon: <MaterialIcons name="health-and-safety" size={24} color={colors.Negative} />,
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
function GetAvailableYear(): number[] {
  const years: number[] = [];
  budgetEvent.forEach((item: BudgetEvent, index: number) => {
    if (!years.includes(item.date.getFullYear())) {
      years.push(item.date.getFullYear());
    }
  });
  return years;
}
function GetMonthlyBudget(data: BudgetEvent[], year: number) {
  // need data : [
  //   month:{
  //     categories:[],
  //     expense:0,
  //     budget:0
  //   }
  // ]
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
      }
    });
  }
  console.log('Update existing budget' + JSON.stringify(monthlyBudget));
}
function GetCategoryById(id: number): Category | undefined {
  return expenseCategory.find((i: Category) => i.id === id);
}
function groupBudgetDataFlat(data: BudgetEvent[]) {
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
function groupBudgetDataTree(data: BudgetEvent[]) {
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
  budgetEvent,
  expenseCategory,
  monthlyBudget,
  GetAvailableYear,
  GetMonthlyBudget,
  SetMonthlyBudget,
  GetCategoryById,
  groupBudgetDataFlat,
  groupBudgetDataTree,
};
