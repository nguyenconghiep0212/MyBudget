import { Text, View, StyleSheet } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import Button from '@/components/elements/Button';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import { Badge, Divider } from 'react-native-paper';
import MainBudget from '@/components/home/mainBudget';
import BudgetSummary from '@/components/home/budgetSummary';
import Today from '@/components/home/date';
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
  const router = useRouter();
  const { isDark } = useColorScheme();
  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <Today></Today>
      <MainBudget style={{ paddingTop: 20 }} />
      <Divider style={{ width: '100%', marginTop: 40, marginBottom: 20 }} />
      <BudgetSummary />
      {/*  
      <Button
        title="Go to Details"
        titleStyle={[styles.buttonTitle, isDark && { color: colors.blackGray }]}
        style={styles.button}
        onPress={() =>
          router.push({ pathname: '(main)/(tabs)/home/details', params: { from: 'Home' } })
        }
      /> */}
    </View>
  );
}
