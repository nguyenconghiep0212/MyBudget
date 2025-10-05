import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '@/theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  link: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default function NotFoundScreen() {
  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text style={{ color: colors.lightGray, fontSize: 26, marginBottom: 18 }}>
        Cannot find page
      </Text>
      <Link href="/home" style={styles.link}>
        <Text style={styles.title}>Go to home screen!</Text>
      </Link>
    </View>
  );
}
