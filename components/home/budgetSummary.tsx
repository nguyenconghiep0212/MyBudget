import { Text, View, StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native';
import { Divider, SegmentedButtons, Surface } from 'react-native-paper';
import { GetCategoryById, budgetEvent } from '@/local_data/data';
import React, { useCallback, useEffect } from 'react';
import { colors } from '@/theme';
import { days, formatCurrency, getWeekOfYear, months } from '@/utils/helper';
import { Category } from '@/types/budget';
import { useFocusEffect } from 'expo-router';
const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: '100%',
  },
  surface: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 4,
    width: '100%',
    backgroundColor: colors.blackGray,
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
    borderRadius: 10,
    marginTop: -2,
    padding: 6,
  },
});

type BudgetSummaryProps = {
  style?: StyleProp<ViewStyle>;
};
type SummaryDataDisplay = {
  date: string | Date;
  expense: number;
  expenseCategories: Category[];
};

const BudgetSummary = ({ style }: BudgetSummaryProps) => {
  const [data, setData] = React.useState<SummaryDataDisplay[]>([]);
  const [summaryTime, setSummaryTime] = React.useState('day');
  function OnChangeTimeSummary(filter: string) {
    const displayData: SummaryDataDisplay[] = [];
    setSummaryTime(filter);
    if (filter === 'day') {
      budgetEvent.forEach((item, index) => {
        const temp = displayData.find(
          i =>
            i.date ===
            days[item.date.getDay()].slice(0, 3) +
              ' ' +
              item.date.getDate() +
              ' - ' +
              (item.date.getMonth() + 1) +
              ' - ' +
              item.date.getFullYear(),
        );
        if (temp !== undefined) {
          temp.expense += item.amount;
          if (
            temp.expenseCategories.find(i => i.id === item.categoryId) === undefined &&
            item.categoryId !== undefined
          ) {
            temp.expenseCategories.push(GetCategoryById(item.categoryId)!);
          }
        } else {
          displayData.push({
            date:
              days[item.date.getDay()].slice(0, 3) +
              ' ' +
              item.date.getDate() +
              ' - ' +
              (item.date.getMonth() + 1) +
              ' - ' +
              item.date.getFullYear(),
            expense: item.amount,
            expenseCategories:
              item.categoryId !== undefined ? [GetCategoryById(item.categoryId)!] : [],
          });
        }
      });
    }
    if (filter === 'week') {
      budgetEvent.forEach((item, index) => {
        const temp = displayData.find(
          i => i.date === 'Week ' + getWeekOfYear(item.date) + ' - ' + item.date.getFullYear(),
        );
        if (temp !== undefined) {
          temp.expense += item.amount;
          if (
            temp.expenseCategories.find(i => i.id === item.categoryId) === undefined &&
            item.categoryId !== undefined
          ) {
            temp.expenseCategories.push(GetCategoryById(item.categoryId)!);
          }
        } else {
          displayData.push({
            date: 'Week ' + getWeekOfYear(item.date) + ' - ' + item.date.getFullYear(),
            expense: item.amount,

            expenseCategories:
              item.categoryId !== undefined ? [GetCategoryById(item.categoryId)!] : [],
          });
        }
      });
    }
    if (filter === 'month') {
      budgetEvent.forEach((item, index) => {
        const temp = displayData.find(
          i => i.date === 'Month ' + (item.date.getMonth() + 1) + ' - ' + item.date.getFullYear(),
        );
        if (temp !== undefined) {
          temp.expense += item.amount;
          if (
            temp.expenseCategories.find(i => i.id === item.categoryId) === undefined &&
            item.categoryId !== undefined
          ) {
            temp.expenseCategories.push(GetCategoryById(item.categoryId)!);
          }
        } else {
          displayData.push({
            date: 'Month ' + (item.date.getMonth() + 1) + ' - ' + item.date.getFullYear(),
            expense: item.amount,
            expenseCategories:
              item.categoryId !== undefined ? [GetCategoryById(item.categoryId)!] : [],
          });
        }
      });
    }
    setData(displayData);
  }
  useEffect(() => {
    OnChangeTimeSummary(summaryTime);
  }, []);
  useFocusEffect(
    useCallback(() => {
      OnChangeTimeSummary(summaryTime);
    }, []),
  );
  const DataCard = data.map((item, index) => (
    <Surface style={[styles.surface]} key={index}>
      {index === 0 && (
        <Divider style={{ width: '100%', backgroundColor: colors.darkGray, height: 1.5 }}></Divider>
      )}
      <View style={[styles.superContainer, { paddingVertical: 4 }]}>
        <View style={[styles.superContainer, { marginLeft: 6 }]}>
          <Text
            style={[
              styles.superItemContainer,
              { color: colors.lightGray, fontWeight: 400, fontSize: 16 },
            ]}>
            {item.date.toString()}
          </Text>
          <View style={[styles.superItemContainer, { alignItems: 'flex-end', paddingRight: 8 }]}>
            <Text style={[styles.textMoney, { color: colors.Negative, fontWeight: 200 }]}>
              -{formatCurrency(item.expense)}
            </Text>
          </View>
        </View>
        <View style={[styles.superItemContainer, styles.superContainer]}>
          {item.expenseCategories.map((cat, idx) => (
            <View
              key={idx}
              style={[
                styles.icon,
                {
                  borderColor: colors.Negative,
                  transform: [{ scale: 0.6 }],
                  marginLeft: idx > 0 ? -10 : 0,
                },
              ]}>
              {cat.icon}
            </View>
          ))}
        </View>
      </View>
      <Divider style={{ width: '100%', backgroundColor: colors.darkGray, height: 1.5 }}></Divider>
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
