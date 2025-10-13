import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import NavigationHeaderLeft from '@/components/_layouts/NavigationHeaderLeft';
import NavigationHeaderTitle from '@/components/_layouts/NavigationHeaderTitle';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';

export default function AnaltylicsStackLayout() {
  const navigation = useNavigation();
  const { isDark } = useColorScheme();
  const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.white,
        headerStyle: { backgroundColor: isDark ? colors.blackGray : colors.darkPurple },
        headerTitleStyle: { fontSize: 18 },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Analytics',
          headerTitle: () => <NavigationHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
