import { fetchGoldPrice, getAllFiles, GOLD_BRAND, refreshApiKey, RemoveFile } from '@/services';
import { colors } from '@/theme';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: colors.darkGray,
    paddingHorizontal: 12,
  },
});
const Currency = () => {
  async function GetGoldPrice(brand: GOLD_BRAND) {
    const res = await fetchGoldPrice(brand);
    if (res) {
      console.log(JSON.stringify(res));
    }
  }
  useFocusEffect(
    useCallback(() => {
      // GetGoldPrice(GOLD_BRAND.SJC);
    }, []),
  );
  return (
    <View style={[styles.body]}>
      <Text style={{ color: colors.lightGray }}>Exchange Rate</Text>
    </View>
  );
};

export default Currency;
