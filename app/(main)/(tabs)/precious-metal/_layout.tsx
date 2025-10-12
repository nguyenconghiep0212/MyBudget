import { Stack } from 'expo-router';
import NavigationHeaderTitle from '@/components/_layouts/NavigationHeaderTitle';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { ActivityIndicator, View } from 'react-native';
import { usePreciousMetalSlice } from '@/slices';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { useEffect, useState } from 'react';

export default function ProfileStackLayout() {
  const { isDark } = useColorScheme();
  const { dispatch, loadingDataApi, loadingKeyApi, RefreshGoldPrice, RefreshKey, availableKey } =
    usePreciousMetalSlice();
  const [apiRestriction, setApiRestriction] = useState<boolean>(false);
  const [keyRestriction, setKeyRestriction] = useState<boolean>(false);
  function TimeApiRestriction(func: Function) {
    const timeout = 2;
    setApiRestriction(true);
    func();
    setTimeout(() => {
      setApiRestriction(false);
    }, timeout * 1_000);
  }
  function TimeKeyRestriction(func: Function) {
    const timeout = 30;
    setKeyRestriction(true);
    func();
    setTimeout(() => {
      setKeyRestriction(false);
    }, timeout * 1_000);
  }
  useEffect(() => {}, [apiRestriction, keyRestriction]);
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
                      if (!apiRestriction) TimeApiRestriction(() => dispatch(RefreshGoldPrice()));
                    }}
                  />
                </View>
              )}
              {loadingKeyApi ? (
                <View style={{ width: 50, justifyContent: 'center' }}>
                  <ActivityIndicator size="large" color={colors.white} />
                </View>
              ) : (
                <View style={{ width: 50, justifyContent: 'center' }}>
                  <IconButton
                    icon={() => (
                      <FontAwesome5
                        name="key"
                        size={24}
                        color={
                          availableKey && !keyRestriction ? colors.NavyBlueText : colors.darkGray
                        }
                      />
                    )}
                    size={20}
                    onPress={() => {
                      if (!keyRestriction) TimeKeyRestriction(() => dispatch(RefreshKey()));
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
