import { View, StyleSheet } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import Exchange from '@/components/exhange/exchange';
import ExchangeRateTable from '@/components/exhange/exchangeRateTable';
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 20,
    paddingLeft: 20,
    color: 'white',
    rowGap: 8,
  },
});

export default function Index() {
  const { isDark } = useColorScheme();

  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <Exchange />
      <ExchangeRateTable />
    </View>
  );
}
