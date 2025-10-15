import { budgetEvent, expenseCategory, monthlyBudget } from '@/local_data/data';
import { colors } from '@/theme';
import { BudgetEvent, MonthlyBudget } from '@/types/budget';
import { useFocusEffect } from 'expo-router';
import { ReactNode, useCallback, useState } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
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
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
});
type AnalyticProps = {
  style?: StyleProp<ViewStyle>;
  selectedYear: number;
  title?: ReactNode;
};

const CategoryChart = ({ title, selectedYear, style }: AnalyticProps) => {
  const [thisYearBudget, setThisYearBudget] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([
    { value: 54, color: '#177AD5', text: '54%' },
    { value: 40, color: '#79D2DE', text: '30%' },
    { value: 20, color: '#ED6665', text: '26%' },
  ]);
  function getTotalCategorySpending(
    events: BudgetEvent[],
    monthlyBudgets: MonthlyBudget[],
    selectedYear: number,
  ) {
    const totals: { [key: number]: number } = {};
    setThisYearBudget(monthlyBudgets.find(b => b.year === selectedYear)?.amount || 0);
    events.forEach(event => {
      const year = event.date.getFullYear();
      if (year === selectedYear) {
        // Aggregate spending by categoryId
        if (!totals[event.categoryId]) {
          totals[event.categoryId] = 0;
        }
        totals[event.categoryId] += event.amount;
      }
    });
    // const temp =
    console.log(totals);
    return totals;
  }
  function MapCatWithColor(id: number) {
    switch (id) {
      case 1:
        return colors.marianBlue;
      case 2:
        return colors.biceBlue;
      case 3:
        return colors.moonStone;
      case 4:
        return colors.pistachino;
      case 5:
        return colors.straw;
      case 6:
        return colors.maize;
      case 7:
        return colors.saffron;
      case 8:
        return colors.sandyBrown;
      case 9:
        return colors.burntSenna;
      case 10:
        return colors.cordovan;
      default:
        return colors.white;
    }
  }
  useFocusEffect(
    useCallback(() => {
      getTotalCategorySpending(budgetEvent, monthlyBudget, selectedYear);
    }, []),
  );
  return (
    <View style={[style]}>
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
        <PieChart
          showText
          textColor="black"
          radius={150}
          textSize={20}
          showTextBackground
          textBackgroundRadius={26}
          data={chartData}
        />
      </Surface>
    </View>
  );
};

export default CategoryChart;
