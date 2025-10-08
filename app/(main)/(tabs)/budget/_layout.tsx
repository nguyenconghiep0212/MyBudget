import { Stack } from 'expo-router';
import NavigationHeaderTitle from '@/components/_layouts/NavigationHeaderTitle';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { useBudgetSlice } from '@/slices';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function HomeStackLayout() {
  const { dispatch, viewMode, ChangeViewMode } = useBudgetSlice();
  const { isDark } = useColorScheme();
  useEffect(() => {}, [viewMode]);
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
          title: 'Budget',
          headerTitle: () => <NavigationHeaderTitle />,
          headerLeft: () => (
            <View>
              <IconButton
                icon={() => (
                  <FontAwesome
                    name="table"
                    size={18}
                    color={viewMode === 'summary' ? colors.white : colors.gray}
                  />
                )}
                containerColor={colors.darkGray}
                size={20}
                onPress={() => dispatch(ChangeViewMode())}></IconButton>
            </View>
          ),
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
