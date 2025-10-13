import { Text, View, StyleSheet } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import Button from '@/components/_layouts/Button';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import Analytic from '@/components/analytics';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGrayPurple,
  },
});

export default function Home() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <Analytic />
    </View>
  );
}
