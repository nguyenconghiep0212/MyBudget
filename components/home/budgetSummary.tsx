import { Text, View, StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { SegmentedButtons, Surface } from 'react-native-paper';
import { summaryData } from '@/local_data/data';
import React, { useEffect } from 'react';
import { colors } from '@/theme';
import { formatCurrency, getWeekOfYear, months } from '@/utils/helper';
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
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
  },
  textMoney: {
    fontWeight: 600,
    fontSize: 16,
  },
});

type MainBudgetProps = {
  style?: StyleProp<ViewStyle>;
};
type SummaryDataDisplay = {
  date: String | Date;
  income: number;
  expense: number;
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
          if (item.typeId == 2) {
            temp.income += item.amount;
          }
          if (item.typeId == 1) {
            temp.expense += item.amount;
          }
        } else {
          displayData.push({
            date: item.date.toDateString(),
            income: item.typeId == 2 ? item.amount : 0,
            expense: item.typeId == 1 ? item.amount : 0,
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
          if (item.typeId == 2) {
            temp.income += item.amount;
          }
          if (item.typeId == 1) {
            temp.expense += item.amount;
          }
        } else {
          displayData.push({
            date: 'Week ' + getWeekOfYear(item.date) + ' / ' + item.date.getFullYear(),
            income: item.typeId == 2 ? item.amount : 0,
            expense: item.typeId == 1 ? item.amount : 0,
          });
        }
      });
    }
    if (filter == 'month') {
      summaryData.forEach((item, index) => {
        const temp = displayData.find(
          i => i.date === months[item.date.getMonth()] + ' ' + item.date.getFullYear(),
        );
        if (temp != undefined) {
          if (item.typeId == 2) {
            temp.income += item.amount;
          }
          if (item.typeId == 1) {
            temp.expense += item.amount;
          }
        } else {
          displayData.push({
            date: months[item.date.getMonth()] + ' ' + item.date.getFullYear(),
            income: item.typeId == 2 ? item.amount : 0,
            expense: item.typeId == 1 ? item.amount : 0,
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
      <View style={[styles.superContainer, { marginLeft: 6 }]}>
        <Text style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>
          {item.date.toString()}
        </Text>
        <View style={{ backgroundColor: 'gray', height: 2 }}></View>
      </View>
      <View style={styles.superContainer}>
        <View style={[styles.superItemContainer, { paddingLeft: 12 }]}></View>
        <View style={[styles.superItemContainer, { alignItems: 'flex-end', paddingRight: 12 }]}>
          <Text style={[styles.textMoney, { color: colors.Positive }]}>
            {item.income ? formatCurrency(item.income) + ' ↑' : '-'}
          </Text>
          <Text style={[styles.textMoney, { color: colors.Negative }]}>
            {item.expense ? formatCurrency(item.expense) + ' ↓' : '-'}
          </Text>
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
