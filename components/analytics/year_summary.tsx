import { colors } from '@/theme';
import { formatCurrency, GetToday, months } from '@/utils/helper';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { GetCategoryById, budgetEvent, monthlyBudget } from '@/local_data/data';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { ReactNode, use, useCallback, useEffect, useState } from 'react';
import { BudgetEvent, MonthlyBudget } from '@/types/budget';
import { Divider, MD3Colors, ProgressBar, Surface } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
const styles = StyleSheet.create({
  superContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
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
};

type YearSummary = {
  year: number;
  income: number;
  budget: number;
  expense: number;
};
const YearSummary = ({ selectedYear, style }: AnalyticProps) => {
  const [yearData, setYearData] = useState<YearSummary>({
    year: 0,
    income: 0,
    budget: 0,
    expense: 0,
  });

  function CombineBudgetsAndExpenses(budgetEvents: BudgetEvent[], monthlyBudgets: MonthlyBudget[]) {
    const result: YearSummary = {
      year: selectedYear,
      income: 0,
      budget: 0,
      expense: 0,
    };
    budgetEvents.forEach((event: BudgetEvent) => {
      if (new Date(event.date).getFullYear() === selectedYear) {
        result.expense += event.amount;
      }
    });
    monthlyBudgets.forEach((item: MonthlyBudget) => {
      if (item.year === selectedYear) {
        result.income += item.salary;
        result.budget += item.amount;
      }
    });
    Object.assign(yearData, result);
    setYearData(result);
    return result;
  }
  function CalculateRemainBudget(): string {
    let result = '';
    if (yearData.expense > yearData.budget) {
      result =
        'You have exceeded your budget by ' +
        ((yearData.expense / yearData.budget) * 100).toFixed(0) +
        '%';
    } else {
      result =
        'You have spent ' +
        ((yearData.expense / yearData.budget) * 100).toFixed(0) +
        '% of your budget';
    }
    return result;
  }
  function CalculateBudgetProgress(): string {
    return ((yearData.expense / yearData.budget) * 100).toFixed(0);
  }
  useEffect(() => {
    CombineBudgetsAndExpenses(budgetEvent, monthlyBudget);
    CalculateRemainBudget();
  }, [selectedYear]);
  useEffect(() => {}, [yearData]);
  useFocusEffect(
    useCallback(() => {
      CombineBudgetsAndExpenses(budgetEvent, monthlyBudget);
      CalculateRemainBudget();
    }, []),
  );
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
              marginLeft: 8,
              paddingTop: 1,
              color: colors.gray,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 0.75,
            }}>
            {`${selectedYear} summary`}
          </Text>
        </View>
        <View>
          <View style={{ flexDirection: 'row', gap: 5, marginHorizontal: 16, marginBottom: 4 }}>
            <Text
              style={{
                paddingTop: 1,
                color: colors.gray,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: 1,
              }}>
              Income:
            </Text>
            <Text
              style={{
                marginLeft: 8,
                paddingTop: 1,
                color: colors.NavyBlueText,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: 1.75,
              }}>
              {formatCurrency(yearData.income)}
            </Text>
          </View>
          <Divider horizontalInset style={{ backgroundColor: colors.darkGray, height: 2 }} />
          <View style={[styles.superContainer, { paddingHorizontal: 16, marginTop: 8 }]}>
            <View style={[styles.superItemContainer]}>
              <Text
                style={{
                  paddingTop: 1,
                  color: colors.lightGray,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}>
                Budget
              </Text>
              <Text
                style={{
                  paddingTop: 1,
                  color: colors.Positive,
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: 2,
                }}>
                {formatCurrency(yearData.budget)}
              </Text>
            </View>
            <View style={{ ...styles.superItemContainer, alignItems: 'flex-end' }}>
              <Text
                style={{
                  paddingTop: 1,
                  color: colors.lightGray,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}>
                Expense
              </Text>
              <Text
                style={{
                  paddingTop: 1,
                  color: colors.Negative,
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: 2,
                }}>
                {formatCurrency(yearData.expense)}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 4, paddingHorizontal: 16 }}>
            <PieChart
              showText
              fontWeight={'700'}
              textColor={colors.black}
              radius={40}
              textSize={18}
              data={[
                {
                  value: yearData.budget - yearData.expense,
                  color: colors.Positive,
                  text: 100 - parseInt(CalculateBudgetProgress()) + '%',
                },
                {
                  value: yearData.expense,
                  color: colors.Negative,
                  text: CalculateBudgetProgress() + '%',
                },
              ]}
            />
            <Text
              style={[
                {
                  marginTop: 8,
                  fontSize: 12,
                  letterSpacing: 1,
                  fontWeight: 400,
                  color: colors.gray,
                  textAlign: 'center',
                },
              ]}>
              {CalculateRemainBudget()}
            </Text>
          </View>
        </View>
      </Surface>
    </View>
  );
};

export default YearSummary;
