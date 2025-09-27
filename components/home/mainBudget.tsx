import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { formatCurrency } from '@/utils/helper';
import { MD3Colors, ProgressBar } from 'react-native-paper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    alignItems: 'center',
  },
  superContainer: {
    flex: 1,
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
  const thisMonthBudget = 4_520_000;
  const thisMonthExpense = 2_430_000;
  return (
    <View style={[styles.body, style]}>
      <View style={[styles.superContainer, style]}>
        <View style={[styles.superItemContainer]}>
          <Text style={[styles.text, { fontWeight: 200 }]}>This month budget</Text>
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
      <View style={{ width: '50%' }}>
        <ProgressBar progress={0.5} />
      </View>
    </View>
  );
};

export default MainBudget;
