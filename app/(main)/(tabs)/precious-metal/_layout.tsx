import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import NavigationHeaderLeft from '@/components/_layouts/NavigationHeaderLeft';
import NavigationHeaderTitle from '@/components/_layouts/NavigationHeaderTitle';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { View } from 'react-native';
import { usePreciousMetalSlice } from '@/slices';
import { FontAwesome } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

export default function ProfileStackLayout() {
  const navigation = useNavigation();
  const { isDark } = useColorScheme();
  const { dispatch, RefreshGoldPrice } = usePreciousMetalSlice();

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
          title: 'Precious Metal',
          headerTitle: () => <NavigationHeaderTitle />,
          headerLeft: () => (
            <View>
              <IconButton
                icon={() => <FontAwesome name="refresh" size={24} color={colors.gray} />}
                size={20}
                onPress={() => dispatch(RefreshGoldPrice())}></IconButton>
            </View>
          ),
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
