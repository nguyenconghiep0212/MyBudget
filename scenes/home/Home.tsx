import { Text, View, StyleSheet } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { ActivityIndicator, Divider } from 'react-native-paper';
import MainBudget from '@/components/home/mainBudget';
import BudgetSummary from '@/components/home/budgetSummary';
import Today from '@/components/_common/date';
import { GetExpenseFromFile, GetMonthlyBudgetFromFile } from '@/local_data/data';
import { useEffect, useState } from 'react';
import { GetGoldFromFile } from '@/local_data/assets';
import { useBudgetSlice } from '@/slices';
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 20,
    paddingLeft: 20,
    color: 'white',
  },
});

export default function Home() {
  const [initFinish, setInitFinish] = useState<boolean>(false);
  const { refreshDataFiles } = useBudgetSlice();

  const { isDark } = useColorScheme();
  async function InitData() {
    await Promise.all([GetMonthlyBudgetFromFile(), GetExpenseFromFile(), GetGoldFromFile()]);
    setInitFinish(true);
  }
  useEffect(() => {
    setInitFinish(false);
    setTimeout(() => {
      InitData();
    }, 1000);
  }, [refreshDataFiles]);

  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      {initFinish ? (
        <>
          <Today></Today>
          <MainBudget style={{ paddingTop: 20 }} />
          <Divider
            style={{
              width: '100%',
              marginTop: 20,
              marginBottom: 15,
              height: 2,
              backgroundColor: colors.lightGray,
            }}
          />
          <BudgetSummary />
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={{ color: colors.gray, fontSize: 24, marginTop: 12, fontWeight: 600 }}>
            Fetching data...
          </Text>
        </View>
      )}
    </View>
  );
}
