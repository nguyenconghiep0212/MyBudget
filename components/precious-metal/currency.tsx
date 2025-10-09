import { fetchGoldPrice, getAllFiles, GOLD_BRAND, refreshApiKey, RemoveFile } from '@/services';
import { colors } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
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
    <View style={[styles.body, { marginTop: 12 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <MaterialIcons name="currency-exchange" size={24} color={colors.exchange} />
        <Text
          style={{
            color: colors.gray,
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: 1.5,
          }}>
          EXCHANGE
        </Text>
        <View
          style={{
            flexGrow: 1,
            marginRight: 4,
            height: 1.5,
            backgroundColor: colors.gray,
          }}></View>
      </View>
    </View>
  );
};

export default Currency;
