import { colors } from '@/theme';
import { months } from '@/utils/helper';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { budgetEvent, monthlyBudget } from '@/local_data/data';
import { BarChart } from 'react-native-gifted-charts';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BudgetEvent, MonthlyBudget } from '@/types/budget';
import { Surface } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { useBudgetSlice } from '@/slices';
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
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
    alignItems: 'center',
    justifyContent: 'center',
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
  selectedYear: number;
  title?: ReactNode;
};

type YearSummary = {
  year: number;
  months: {
    month: number;
    income: number;
    budget: number;
    expense: number;
  }[];
};
type ChartData = {
  value: number;
  label?: string;
  spacing?: number;
  labelWidth?: number;
  labelTextStyle?: { color: string };
  frontColor: string;
  labelComponent?: () => ReactNode;
  topLabelComponent?: () => ReactNode;
};
const YearSummaryChart = ({ title, selectedYear, style }: AnalyticProps) => {
  const { refreshDataFiles } = useBudgetSlice();

  let [yearData, setYearData] = useState<YearSummary[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [monthExceedBudget, setMonthExceedBudget] = useState<number>(0);
  const [monthWithinBudget, setMonthWithinBudget] = useState<number>(0);
  const [chartOptions, setChartOption] = useState<any>({
    noOfSections: 0,
    stepValue: 0,
  });

  function CombineBudgetsAndExpenses(budgetEvents: BudgetEvent[], monthlyBudgets: MonthlyBudget[]) {
    const result: YearSummary[] = [];

    // Create a map to aggregate expenses
    const expenseMap: { [key: string]: number } = {};

    // Populate the expense map
    budgetEvents.forEach((event: BudgetEvent) => {
      const eventDate = new Date(event.date);
      const year = eventDate.getFullYear();
      if (year === selectedYear) {
        const month = eventDate.getMonth() + 1; // getMonth() returns 0-11
        const key = `${year}-${month}`;
        expenseMap[key] = (expenseMap[key] || 0) + event.amount;
      }
    });
    // Aggregate data into the result structure
    monthlyBudgets.forEach((item: MonthlyBudget) => {
      if (item.year === selectedYear) {
        const key = `${item.year}-${item.month}`;
        const expenses = expenseMap[key] || 0;

        // Find or create the year entry
        let yearEntry = result.find(y => y.year === item.year);
        if (!yearEntry) {
          yearEntry = { year: item.year, months: [] };
          result.push(yearEntry);
        }

        // Find or create the month entry
        let monthEntry = yearEntry.months.find(m => m.month === item.month);
        if (!monthEntry) {
          monthEntry = {
            month: item.month,
            budget: item.amount,
            income: item.salary,
            expense: expenses,
          };
          yearEntry.months.push(monthEntry);
        } else {
          monthEntry.income += item.amount;
          monthEntry.expense += expenses; // Add expenses if the month entry already exists
        }
      }
    });
    yearData = result;
    setYearData(result);
    return result;
  }
  function SetChartData() {
    const offset = 1_000_000;

    const tempYearData = [];
    let localMonthWithinBudget = 0;
    let localMonthExceedBudget = 0;
    for (let index = 1; index <= 12; index++) {
      const findMonth =
        yearData.length > 0 ? yearData[0].months.find(item => item.month === index) : false;
      if (findMonth) {
        if (findMonth.expense <= findMonth.budget) {
          localMonthWithinBudget++;
          setMonthWithinBudget(localMonthWithinBudget);
        } else {
          localMonthExceedBudget++;
          setMonthExceedBudget(localMonthExceedBudget);
        }
        tempYearData.push(findMonth);
      } else {
        tempYearData.push({ month: index, budget: 0, income: 0, expense: 0 });
      }
    }

    const temp: ChartData[] = [];
    tempYearData.forEach((item: any) => {
      const temp1: ChartData = {
        value: item.budget / offset,
        spacing: 2,
        labelWidth: 30,
        labelTextStyle: { color: colors.gray },
        frontColor: colors.Positive,
        labelComponent: () => customLabel(months[item.month - 1].slice(0, 3)),
        topLabelComponent: () => (
          <Text
            style={{
              color: colors.lightGray,
              fontSize: 6,
              position: 'absolute',
              width: 12,
              textAlign: 'center',
              marginTop: -4,
              letterSpacing: -0.5,
            }}>
            {(item.budget / offset).toFixed(1)}
          </Text>
        ),
      };
      const temp2: ChartData = {
        value: item.expense / offset,
        frontColor: colors.Negative,
        topLabelComponent: () => (
          <Text
            style={{
              color: colors.lightGray,
              fontSize: 6,
              position: 'absolute',
              width: 12,
              textAlign: 'center',
              letterSpacing: -0.5,
              marginTop: -4,
            }}>
            {(item.expense / offset).toFixed(1)}
          </Text>
        ),
      };
      temp.push(temp1);
      temp.push(temp2);
    });
    setChartData(temp);

    // Chart Option
    const noOfSections = 5;
    const stepValue =
      yearData.length > 0
        ? Math.ceil(
            Math.max(...yearData[0].months.map((item: any) => item.budget)) / offset / noOfSections,
          )
        : 5;
    setChartOption({
      noOfSections,
      stepValue,
    });
  }

  useEffect(() => {
    CombineBudgetsAndExpenses(budgetEvent, monthlyBudget);
    SetChartData();
  }, [selectedYear, refreshDataFiles]);
  useEffect(() => {}, [chartData, chartOptions, monthWithinBudget, monthExceedBudget]);
  useFocusEffect(
    useCallback(() => {
      CombineBudgetsAndExpenses(budgetEvent, monthlyBudget);
      SetChartData();
    }, []),
  );
  const customLabel = (val: string) => {
    return (
      <View style={{ width: 18, alignItems: 'center' }}>
        <Text
          style={{
            color: colors.lightGray,
            fontWeight: 300,
            fontSize: 8,
          }}>
          {val}
        </Text>
      </View>
    );
  };
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
        <View style={{ flexDirection: 'column', marginBottom: 8 }}>
          {title || (
            <Text
              style={{
                marginLeft: 8,
                paddingTop: 1,
                color: colors.gray,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 0.75,
              }}>
              {selectedYear} monthly
            </Text>
          )}
          <Text
            style={{
              ...styles.surfaceSubTitle,
              fontWeight: 600,
            }}>
            Month exceed budget:{' '}
            <Text
              style={{
                ...styles.surfaceSubTitle,
                fontWeight: 800,
                color: colors.Negative,
              }}>
              {monthExceedBudget}
            </Text>
          </Text>
          <Text
            style={{
              ...styles.surfaceSubTitle,
              fontWeight: 600,
            }}>
            Month within budget:{' '}
            <Text
              style={{
                ...styles.surfaceSubTitle,
                fontWeight: 800,
                color: colors.Positive,
              }}>
              {monthWithinBudget}
            </Text>
          </Text>
        </View>
        <View style={styles.superContainer}>
          <View style={[styles.superItemContainer, { paddingLeft: 8 }]}>
            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
              <View
                style={{
                  width: 18,
                  borderRadius: 2,
                  height: 8,
                  backgroundColor: colors.Positive,
                }}></View>
              <Text style={{ color: colors.lightGray, fontSize: 12, letterSpacing: 0.75 }}>
                Budget
              </Text>
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
          </View>
          <View style={[styles.superItemContainer, { alignItems: 'flex-end', paddingRight: 18 }]}>
            <Text style={{ color: colors.gray, fontSize: 10, letterSpacing: 0.75 }}>
              Unit: 1,000,000 vnd
            </Text>
          </View>
        </View>

        <BarChart
          data={chartData}
          barWidth={6}
          spacing={9}
          // roundedTop
          // roundedBottom
          // hideRules
          rulesColor={colors.darkGray}
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={{ fontSize: 10, color: colors.lightGray }}
          noOfSections={chartOptions.noOfSections}
          stepValue={chartOptions.stepValue}
        />
      </Surface>
    </View>
  );
};

export default YearSummaryChart;
