import { Text, View, StyleSheet } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import Button from '@/components/elements/Button';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import BudgetEvent from '@/components/budget/BudgetEvent';

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
  const router = useRouter();
  const { isDark } = useColorScheme();
  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <BudgetEvent />
    </View>
  );
}
