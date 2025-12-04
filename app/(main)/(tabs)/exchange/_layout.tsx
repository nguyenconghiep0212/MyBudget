import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import NavigationHeaderLeft from '@/components/_layouts/NavigationHeaderLeft';
import NavigationHeaderTitle from '@/components/_layouts/NavigationHeaderTitle';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { FontAwesome } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useExchangeSlice } from '@/slices/exchange.slice';

export default function HomeStackLayout() {
  const navigation = useNavigation();
  const { isDark } = useColorScheme();
  const { dispatch, loadingDataApi, RefreshExchangePrice } = useExchangeSlice();
  const [apiRestriction, setApiRestriction] = useState<boolean>(false);
  function TimeApiRestriction(func: Function) {
    const timeout = 2;
    setApiRestriction(true);
    func();
    setTimeout(() => {
      setApiRestriction(false);
    }, timeout * 1_000);
  }
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
          title: 'Exchange',
          headerTitle: () => <NavigationHeaderTitle />,
          headerLeft: () => (
            <View style={{ flexDirection: 'row' }}>
              {loadingDataApi ? (
                <View style={{ width: 50, justifyContent: 'center' }}>
                  <ActivityIndicator size="large" color={colors.white} />
                </View>
              ) : (
                <View style={{ width: 50, justifyContent: 'center' }}>
                  <IconButton
                    icon={() => (
                      <FontAwesome
                        name="refresh"
                        size={24}
                        color={apiRestriction ? colors.darkGray : colors.lightGray}
                      />
                    )}
                    size={20}
                    onPress={() => {
                      if (!apiRestriction)
                        TimeApiRestriction(() => dispatch(RefreshExchangePrice()));
                    }}
                  />
                </View>
              )}
            </View>
          ),
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
