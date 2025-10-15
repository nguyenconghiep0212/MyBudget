import { colors } from '@/theme';
import { GetToday, months } from '@/utils/helper';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { GetCategoryById, budgetEvent, monthlyBudget } from '@/local_data/data';
import { BarChart } from 'react-native-gifted-charts';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { BudgetEvent, MonthlyBudget } from '@/types/budget';
import { Surface } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
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
  }[];
};
type ChartData = {
  value: number;
  label?: string;
  spacing?: number;
  labelWidth?: number;
  labelTextStyle?: { color: string };
  frontColor: string;
  labelComponent?: Function;
};
const YearIncomeChart = ({ title, selectedYear, style }: AnalyticProps) => {
  const [yearData, setYearData] = useState<YearSummary[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartOptions, setChartOption] = useState<any>({
    noOfSections: 0,
    stepValue: 0,
  });

  function CombineBudgetsAndExpenses(monthlyBudgets: MonthlyBudget[]) {
    const result: YearSummary[] = [];

    // Aggregate data into the result structure
    monthlyBudgets.forEach((item: MonthlyBudget) => {
      if (item.year === selectedYear) {
        const key = `${item.year}-${item.month}`;

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
            income: item.salary,
          };
          yearEntry.months.push(monthEntry);
        } else {
          monthEntry.income += item.amount;
        }
      }
    });
    Object.assign(yearData, result);
    setYearData(result);
    return result;
  }
  function SetChartData() {
    const offset = 1_000_000;

    const tempYearData = [];
    for (let index = 1; index <= 12; index++) {
      const findMonth = yearData[0].months.find(item => item.month === index);
      if (findMonth) {
        tempYearData.push(findMonth);
      } else {
        tempYearData.push({ month: index, budget: 0, income: 0, expense: 0 });
      }
    }

    const temp: ChartData[] = [];
    tempYearData.forEach((item: any) => {
      const temp1: ChartData = {
        value: item.income / offset,
        spacing: 11,
        labelWidth: 30,
        labelTextStyle: { color: colors.gray },
        frontColor: colors.NavyBlueText,
        labelComponent: () => customLabel(months[item.month - 1].slice(0, 3)),
      };
      temp.push(temp1);
    });
    setChartData(temp);

    // Chart Option
    const maxBudget: any = Math.max(...yearData[0].months.map((item: any) => item.income)) / offset;
    setChartOption({
      noOfSections: Math.ceil(maxBudget),
      stepValue: 1,
    });
  }

  useEffect(() => {
    CombineBudgetsAndExpenses(monthlyBudget);
    SetChartData();
  }, [selectedYear]);
  useEffect(() => {}, [chartData, chartOptions]);
  useFocusEffect(
    useCallback(() => {
      CombineBudgetsAndExpenses(monthlyBudget);
      SetChartData();
    }, []),
  );
  const customLabel = (val: string) => {
    return (
      <View style={{ width: 24, alignItems: 'center' }}>
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
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
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
        </View>
        <View style={styles.superContainer}>
          <View style={[styles.superItemContainer, { paddingLeft: 8 }]}></View>
          <View style={[styles.superItemContainer, { alignItems: 'flex-end', paddingRight: 18 }]}>
            <Text style={{ color: colors.gray, fontSize: 10, letterSpacing: 0.75 }}>
              Unit: 1,000,000 vnd
            </Text>
          </View>
        </View>

        <BarChart
          data={chartData}
          barWidth={12}
          spacing={9}
          // roundedTop
          // roundedBottom
          // hideRules
          rulesColor={colors.darkGray}
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={{ fontSize: 10, color: colors.gray }}
          noOfSections={chartOptions.noOfSections}
          stepValue={chartOptions.stepValue}
        />
      </Surface>
    </View>
  );
};

export default YearIncomeChart;
