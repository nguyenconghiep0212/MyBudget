import { colors } from '@/theme';
import { GetToday } from '@/utils/helper';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { GetCategoryById, budgetEvent, monthlyBudget } from '@/local_data/data';
import { BarChart } from 'react-native-gifted-charts';
import { useEffect, useState } from 'react';
import { BudgetEvent, MonthlyBudget } from '@/types/budget';
import { Surface } from 'react-native-paper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
  superContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    paddingHorizontal: 24,
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  surface: {
    backgroundColor: colors.darkerGray,
    borderRadius: 6,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  surfaceTitle: {
    color: colors.gray,
    fontSize: 18,
    marginLeft: 8,
    marginTop: 8,
    letterSpacing: 1,
    fontWeight: 800,
  },
  surfaceSubTitle: {
    color: colors.gray,
    marginLeft: 8,
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: 400,
  },
});
type AnalyticProps = {
  style?: StyleProp<ViewStyle>;
};
const YearSummary = ({ style }: AnalyticProps) => {
  const [yearData, setYearData] = useState<any>([]);

  function CombineBudgetsAndExpenses(budgetEvents: BudgetEvent[], monthlyBudgets: MonthlyBudget[]) {
    const result: { year: number; month: { month: number; income: number; expense: number }[] }[] =
      [];

    // Create a map to aggregate expenses
    const expenseMap: { [key: string]: number } = {};

    // Populate the expense map
    budgetEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const year = eventDate.getFullYear();
      const month = eventDate.getMonth() + 1; // getMonth() returns 0-11

      const key = `${year}-${month}`;
      expenseMap[key] = (expenseMap[key] || 0) + event.amount;
    });

    // Aggregate data into the result structure
    monthlyBudgets.forEach(budget => {
      const key = `${budget.year}-${budget.month}`;
      const expenses = expenseMap[key] || 0;

      // Find or create the year entry
      let yearEntry = result.find(y => y.year === budget.year);
      if (!yearEntry) {
        yearEntry = { year: budget.year, month: [] };
        result.push(yearEntry);
      }

      // Find or create the month entry
      let monthEntry = yearEntry.month.find(m => m.month === budget.month);
      if (!monthEntry) {
        monthEntry = { month: budget.month, income: budget.amount, expense: expenses };
        yearEntry.month.push(monthEntry);
      } else {
        monthEntry.income += budget.amount;
        monthEntry.expense += expenses; // Add expenses if the month entry already exists
      }
    });

    // Add months with expenses that may not have corresponding budgets
    Object.keys(expenseMap).forEach(key => {
      const [year, month] = key.split('-').map(Number);
      let yearEntry = result.find(y => y.year === year);
      if (!yearEntry) {
        yearEntry = { year, month: [] };
        result.push(yearEntry);
      }

      let monthEntry = yearEntry.month.find(m => m.month === month);
      if (!monthEntry) {
        monthEntry = { month, income: 0, expense: expenseMap[key] };
        yearEntry.month.push(monthEntry);
      } else {
        monthEntry.expense += expenseMap[key]; // Add expenses if the month entry already exists
      }
    });

    console.log('Combined Result:', JSON.stringify(result));
    return result;
  }
  const barData = [
    {
      value: 40,
      label: 'Jan',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 20, frontColor: '#ED6665' },
    {
      value: 50,
      label: 'Feb',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 40, frontColor: '#ED6665' },
    {
      value: 75,
      label: 'Mar',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 25, frontColor: '#ED6665' },
    {
      value: 30,
      label: 'Apr',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 20, frontColor: '#ED6665' },
    {
      value: 60,
      label: 'May',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 40, frontColor: '#ED6665' },
    {
      value: 65,
      label: 'Jun',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 30, frontColor: '#ED6665' },
  ];

  useEffect(() => {
    CombineBudgetsAndExpenses(budgetEvent, monthlyBudget);
  }, []);
  return (
    <View style={style}>
      <Surface
        style={{
          backgroundColor: colors.darkerGray,
          borderRadius: 6,
          marginTop: 10,
          paddingTop: 6,
          paddingBottom: 10,
        }}>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
          <Text
            style={{
              marginLeft: 12,
              paddingTop: 1,
              color: colors.lightGray,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 0.75,
            }}>
            Summary of {GetToday().getFullYear()}
          </Text>
        </View>
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 12 }]}>
          <View
            style={{
              width: 18,
              borderRadius: 2,
              height: 8,
              backgroundColor: colors.Positive,
            }}></View>
          <Text style={{ color: colors.lightGray, fontSize: 12, letterSpacing: 0.75 }}>Income</Text>
          <View
            style={{
              width: 18,
              borderRadius: 2,
              height: 8,
              backgroundColor: colors.Negative,
              marginLeft: 16,
            }}></View>
          <Text style={{ color: colors.lightGray, fontSize: 12, letterSpacing: 0.75 }}>
            Expense
          </Text>
        </View>
        <BarChart
          data={barData}
          barWidth={8}
          spacing={24}
          // roundedTop
          // roundedBottom
          // hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: colors.lightGray }}
          noOfSections={3}
        />
      </Surface>
    </View>
  );
};

export default YearSummary;
