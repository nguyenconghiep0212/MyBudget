import { Text, View, StyleSheet } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import Button from '@/components/elements/Button';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import { Badge } from 'react-native-paper';
import MainBudget from '@/components/home/mainBudget';
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
      <MainBudget style={{ paddingTop: 40 }} />
      {/* <Text style={[styles.title, isDark && { color: colors.gray }]}>Home</Text>
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
