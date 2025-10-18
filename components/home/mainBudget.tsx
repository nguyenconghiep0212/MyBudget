import { Text, View, StyleSheet, StyleProp, ViewStyle, TextInput } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { formatCurrency, GetToday } from '@/utils/helper';
import { MD3Colors, ProgressBar } from 'react-native-paper';
import { budgetEvent, monthlyBudget, SetMonthlyBudget } from '@/local_data/data';
import { AntDesign, Octicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { colors } from '@/theme';
import { useFocusEffect } from 'expo-router';
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
  const [hasSetBudget, setHasSetBudget] = useState<boolean>(false);
  const [thisMonthBudget, setThisMonthBudget] = useState<number>(0);
  const [thisMonthExpense, setThisMonthExpense] = useState<number>(0);
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const today = GetToday();
  const thisMonth = today.getMonth() + 1;
  const thisYear = today.getFullYear();
  function GetThisMonthBudget() {
    monthlyBudget.forEach(item => {
      if (thisMonth === item.month && thisYear === item.year) {
        setThisMonthBudget(item.amount);
        setHasSetBudget(true);
      }
    });
  }
  function SetThisMonthBudget(newBudget: number) {
    const temp = monthlyBudget.find(i => i.month === thisMonth && i.year === thisYear);
    SetMonthlyBudget({
      month: thisMonth,
      year: thisYear,
      amount: newBudget,
      salary: temp ? temp.salary : 0,
    });
    setThisMonthBudget(newBudget);
    setIsEditingBudget(false);
    GetThisMonthBudget();
  }
  function CalculateThisMonthExpense() {
    let total = 0;
    budgetEvent.forEach(item => {
      if (
        thisMonth === new Date(item.date).getMonth() + 1 &&
        thisYear === new Date(item.date).getFullYear()
      ) {
        total += item.amount;
      }
    });
    setThisMonthExpense(total);
  }
  function CalculateRemainBudget(): string {
    let result = '';
    if (thisMonthBudget === 0) {
      result = 'You have not set a budget for this month';
    } else if (thisMonthExpense > thisMonthBudget) {
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
    setIsEditingBudget(!isEditingBudget);
  }
  useEffect(() => {
    CalculateThisMonthExpense();
    GetThisMonthBudget();
  }, []);
  useFocusEffect(
    useCallback(() => {
      CalculateThisMonthExpense();
      GetThisMonthBudget();
    }, []),
  );
  return (
    <View style={[styles.body, style]}>
      <View style={[styles.superContainer]}>
        <View style={[styles.superItemContainer]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={[styles.text, { fontWeight: 200 }]}>This month budget</Text>
            <AntDesign name="edit" size={14} color="gray" onPress={EditThisMonthBudget} />
          </View>
          {isEditingBudget ? (
            <TextInput
              placeholderTextColor="gray"
              placeholder={formatCurrency(thisMonthBudget) + '...'}
              style={{ color: 'white' }}
              keyboardType="numeric"
              onSubmitEditing={event => SetThisMonthBudget(Number(event.nativeEvent.text))}
            />
          ) : (
            <Text style={[styles.text, { letterSpacing: 2, fontSize: 18, fontWeight: 600 }]}>
              {formatCurrency(thisMonthBudget)}
            </Text>
          )}
        </View>
        <View style={[styles.superItemContainer, { alignItems: 'flex-end' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={[styles.text, { fontWeight: 200 }]}>This month expense</Text>
          </View>
          <Text
            style={[
              styles.text,
              { letterSpacing: 2, fontSize: 18, fontWeight: 600, color: colors.Negative },
            ]}>
            {thisMonthExpense !== 0 && '-'}
            {formatCurrency(thisMonthExpense)}
          </Text>
        </View>
      </View>
      <View style={{ paddingTop: 30, width: '75%', margin: 'auto', gap: 5 }}>
        <Text
          style={[
            styles.text,
            { fontSize: hasSetBudget ? 12 : 18, fontWeight: 200, textAlign: 'center' },
          ]}>
          {CalculateRemainBudget()}
        </Text>
        {hasSetBudget && (
          <>
            <ProgressBar
              progress={CalculateBudgetProgress()}
              color={MD3Colors.error60}
              style={{ width: '100%' }}
            />
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: 2,
                color: thisMonthBudget >= thisMonthExpense ? colors.Positive : colors.Negative,
              }}>
              {thisMonthBudget < thisMonthExpense && '-'}
              {formatCurrency(thisMonthBudget - thisMonthExpense)}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default MainBudget;
