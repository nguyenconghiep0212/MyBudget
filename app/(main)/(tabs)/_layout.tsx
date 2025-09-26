import { Tabs } from 'expo-router';
import useColorScheme from '@/hooks/useColorScheme';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function TabLayout() {
  const { isDark } = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: colors.gray,
        tabBarInactiveBackgroundColor: isDark ? colors.blackGray : colors.white,
        tabBarActiveTintColor: colors.lightPurple,
        tabBarActiveBackgroundColor: isDark ? colors.blackGray : colors.white,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ color }) => <AntDesign name="wallet" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="precious-metal"
        options={{
          title: 'Precious Metal',
          tabBarIcon: ({ color }) => <AntDesign name="gold" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
