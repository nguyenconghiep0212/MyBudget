import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { formatCurrency } from '@/utils/helper';
import { Button, MD3Colors, ProgressBar } from 'react-native-paper';
import { summaryData, monthlyBudget } from '@/local_data/data';
import { AntDesign } from '@expo/vector-icons';
import { use, useEffect, useState } from 'react';
const styles = StyleSheet.create({
  body: {
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
  text: {
    color: 'white',
  },
});

type MainBudgetProps = {
  style?: StyleProp<ViewStyle>;
};

const MainBudget = ({ style }: MainBudgetProps) => {
  const { isDark } = useColorScheme();
  const [thisMonthBudget, setThisMonthBudget] = useState<number>(0);
  const [thisMonthExpense, setThisMonthExpense] = useState<number>(0);
  function GetThisMonthBuget() {
    const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const thisYear = today.getFullYear();
    monthlyBudget.forEach(item => {
      if (thisMonth == item.month && thisYear == item.year) {
        setThisMonthBudget(item.amount);
      }
    });
  }
  function CalculateThisMonthExpense() {
    let total = 0;
    summaryData.forEach(item => {
      if (item.typeId == 1) {
        total += item.amount;
      }
    });
    setThisMonthExpense(total);
  }
  function CalculateRemainBudget(): String {
    let result = '';
    if (thisMonthExpense > thisMonthBudget) {
      result =
        'You have exceeded your budget by ' +
        ((thisMonthExpense / thisMonthBudget) * 100).toFixed(0) +
        '%';
    } else {
      result =
        'You have spent ' +
        ((thisMonthExpense / thisMonthBudget) * 100).toFixed(0) +
        '% of your budget';
    }
    return result;
  }
  function CalculateBudgetProgress(): number {
    return thisMonthExpense / thisMonthBudget;
  }
  function EditThisMonthBudget() {
    console.log('Edit this month budget');
  }
  useEffect(() => {
    CalculateThisMonthExpense();
    GetThisMonthBuget();
  }, []);
  return (
    <View style={[styles.body, style]}>
      <View style={[styles.superContainer]}>
        <View style={[styles.superItemContainer]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={[styles.text, { fontWeight: 200 }]}>This month budget</Text>
            <AntDesign name="edit" size={14} color="gray" onPress={EditThisMonthBudget} />
          </View>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 600 }]}>
            {formatCurrency(thisMonthBudget)}
          </Text>
        </View>
        <View style={[styles.superItemContainer, { alignItems: 'flex-end' }]}>
          <Text style={[styles.text, { fontWeight: 200 }]}>This month expense</Text>
          <Text style={[styles.text, { fontSize: 18, fontWeight: 600, color: '#ff7e7eff' }]}>
            <Text>-</Text>
            {formatCurrency(thisMonthExpense)}
          </Text>
        </View>
      </View>
      <View style={{ paddingTop: 40, width: '75%', margin: 'auto', gap: 5 }}>
        <Text style={[styles.text, { fontSize: 12, fontWeight: 200, textAlign: 'center' }]}>
          {CalculateRemainBudget()}
        </Text>
        <ProgressBar
          progress={CalculateBudgetProgress()}
          color={MD3Colors.error60}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
};

export default MainBudget;
