import { Asset } from 'expo-asset';

export const images: { [key: string]: ReturnType<typeof require> } = {
  logo: require('@/assets/images/ic_launcher.png'),
  logo_sm: require('@/assets/images/ic_launcher.png'),
  logo_lg: require('@/assets/images/ic_launcher.png'),
};

// preload images
const preloadImages = () =>
  Object.keys(images).map(key => {
    return Asset.fromModule(images[key] as number).downloadAsync();
  });

export const loadImages = async () => Promise.all(preloadImages());
