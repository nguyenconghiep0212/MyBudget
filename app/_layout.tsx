import { Fragment, useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import BottomSheetContents from '@/components/_layouts/BottomSheetContents';
import BottomSheet from '@/components/_layouts/BottomSheet';
import { useDataPersist, DataPersistKeys } from '@/hooks';
import useColorScheme from '@/hooks/useColorScheme';
import { loadImages, loadFonts, colors } from '@/theme';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppSlice } from '@/slices';
import { getUserAsync } from '@/services';
import Provider from '@/providers';
import { User } from '@/types';
import { Portal } from 'react-native-paper';
import { InitFiles } from '@/services/file.service';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Router() {
  // const { isDark } = useColorScheme();
  // const { dispatch, setUser, setLoggedIn } = useAppSlice();
  // const { setPersistData, getPersistData } = useDataPersist();
  // const [isOpen, setOpen] = useState(false);

  /**
   * preload assets and user info
   */
  useEffect(() => {
    try {
      // preload assets
      InitFiles();
    } catch {
    } finally {
      SplashScreen.hideAsync();
    }
  }, []);

  return (
    <Fragment>
      <Portal.Host>
        <Slot />
      </Portal.Host>
      <StatusBar style="light" />
    </Fragment>
  );
}

export default function RootLayout() {
  return (
    <Provider>
      <Router />
    </Provider>
  );
}
