import { View, StyleSheet } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import BudgetEvent from '@/components/budget/BudgetEvent';
import { useBudgetSlice } from '@/slices';
import BudgetMonthly from '@/components/budget/BudgetMonthly';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGrayPurple,
  },
});

export default function Budget() {
  const { viewMode } = useBudgetSlice();

  const { isDark } = useColorScheme();
  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      {viewMode === 'summary' ? <BudgetMonthly /> : <BudgetEvent />}
    </View>
  );
}
