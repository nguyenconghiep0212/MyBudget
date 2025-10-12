import { colors } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
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
  useFocusEffect(
    useCallback(() => {
      // GetGoldPrice(GOLD_BRAND.SJC);
    }, []),
  );
  return (
    <View style={[styles.body, { marginTop: 12 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <MaterialIcons name="currency-exchange" size={24} color={colors.darkGreen} />
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
