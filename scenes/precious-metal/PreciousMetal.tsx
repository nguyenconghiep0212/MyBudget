import { Text, View, StyleSheet } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import Metal from '@/components/precious-metal/metal';
import Currecy from '@/components/precious-metal/currency';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGrayPurple,
  },
});

export default function PreciousMetal() {
  const router = useRouter();
  return (
    <View style={[styles.root, { backgroundColor: colors.blackGray }]}>
      <Metal></Metal>
      <Currecy></Currecy>
    </View>
  );
}
