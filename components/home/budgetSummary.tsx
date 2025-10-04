import { Text, View, StyleSheet, StyleProp, ViewStyle, ScrollView, TextInput } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { SegmentedButtons, Surface } from 'react-native-paper';
import { GetCategoryById, summaryData } from '@/local_data/data';
import React, { ReactNode, useEffect } from 'react';
import { colors } from '@/theme';
import { formatCurrency, getWeekOfYear, months } from '@/utils/helper';
import { Category } from '@/types/budget';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: '100%',
  },
  surface: {
    padding: 8,
    minHeight: 80,
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
  },
  superContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
  },
  textMoney: {
    letterSpacing: 2,
    fontWeight: 300,
    fontSize: 16,
  },
  icon: {
    transform: [{ scale: 0.8 }],
    borderWidth: 2,
    borderRadius: 6,
    marginTop: 4,
    padding: 6,
  },
});

type MainBudgetProps = {
  style?: StyleProp<ViewStyle>;
};
type SummaryDataDisplay = {
  date: String | Date;
  expense: number;
  expenseCategories: Category[];
};

const BudgetSummary = ({ style }: MainBudgetProps) => {
  const { isDark } = useColorScheme();
  const [data, setData] = React.useState<SummaryDataDisplay[]>([]);
  const [summaryTime, setSummaryTime] = React.useState('day');
  function OnChangeTimeSummary(filter: string) {
    const displayData: SummaryDataDisplay[] = [];
    setSummaryTime(filter);
    if (filter == 'day') {
      summaryData.forEach((item, index) => {
        const temp = displayData.find(i => i.date === item.date.toDateString());
        if (temp != undefined) {
          temp.expense += item.amount;
          if (
            temp.expenseCategories.find(i => i.id == item.categoryId) == undefined &&
            item.categoryId != undefined
          ) {
            temp.expenseCategories.push(GetCategoryById(item.categoryId)!);
          }
        } else {
          displayData.push({
            date: item.date.toDateString(),
            expense: item.amount,
            expenseCategories:
              item.categoryId != undefined ? [GetCategoryById(item.categoryId)!] : [],
          });
        }
      });
    }
    if (filter == 'week') {
      summaryData.forEach((item, index) => {
        const temp = displayData.find(
          i => i.date === 'Week ' + getWeekOfYear(item.date) + ' / ' + item.date.getFullYear(),
        );
        if (temp != undefined) {
          temp.expense += item.amount;
          if (
            temp.expenseCategories.find(i => i.id == item.categoryId) == undefined &&
            item.categoryId != undefined
          ) {
            temp.expenseCategories.push(GetCategoryById(item.categoryId)!);
          }
        } else {
          displayData.push({
            date: 'Week ' + getWeekOfYear(item.date) + ' / ' + item.date.getFullYear(),
            expense: item.amount,

            expenseCategories:
              item.categoryId != undefined ? [GetCategoryById(item.categoryId)!] : [],
          });
        }
      });
    }
    if (filter == 'month') {
      summaryData.forEach((item, index) => {
        const temp = displayData.find(
          i => i.date === months[item.date.getMonth()].slice(0, 3) + ' ' + item.date.getFullYear(),
        );
        if (temp != undefined) {
          temp.expense += item.amount;
          if (
            temp.expenseCategories.find(i => i.id == item.categoryId) == undefined &&
            item.categoryId != undefined
          ) {
            temp.expenseCategories.push(GetCategoryById(item.categoryId)!);
          }
        } else {
          displayData.push({
            date: months[item.date.getMonth()].slice(0, 3) + ' ' + item.date.getFullYear(),
            expense: item.amount,
            expenseCategories:
              item.categoryId != undefined ? [GetCategoryById(item.categoryId)!] : [],
          });
        }
      });
    }
    setData(displayData);
  }
  useEffect(() => {
    OnChangeTimeSummary('day');
  }, []);
  const DataCard = data.map((item, index) => (
    <Surface style={[styles.surface, { backgroundColor: colors.darkGray }]} key={index}>
      <View style={[styles.superContainer, {}]}>
        <View style={[styles.superContainer, { marginLeft: 6 }]}>
          <Text
            style={[
              styles.superItemContainer,
              { color: colors.white, fontWeight: 600, fontSize: 16 },
            ]}>
            {item.date.toString()}
          </Text>
          <View style={[styles.superItemContainer, { alignItems: 'flex-end', paddingRight: 8 }]}>
            <Text style={[styles.textMoney, { color: colors.Negative, fontWeight: 200 }]}>
              {item.expense ? formatCurrency(item.expense) + ' ↓' : '-'}
            </Text>
          </View>
        </View>
        <View style={[styles.superItemContainer, styles.superContainer, { paddingTop: 8 }]}>
          {item.expenseCategories.map((cat, idx) => (
            <View
              key={idx}
              style={[
                styles.icon,
                {
                  borderColor: colors.Negative,
                },
              ]}>
              {cat.icon}
            </View>
          ))}
        </View>
      </View>
    </Surface>
  ));
  return (
    <View style={[styles.body, style]}>
      <SegmentedButtons
        theme={{
          colors: {
            secondaryContainer: colors.NavyBlueBg,
            onSecondaryContainer: 'white',
            onSurface: 'white',
          },
        }}
        value={summaryTime}
        onValueChange={OnChangeTimeSummary}
        buttons={[
          {
            value: 'day',
            label: 'Day',
          },
          {
            value: 'week',
            label: 'Week',
          },
          { value: 'month', label: 'Month' },
        ]}
      />
      <ScrollView style={{ marginTop: 12 }}>{DataCard}</ScrollView>
    </View>
  );
};

export default BudgetSummary;
