import { colors } from '@/theme';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';

import ChartMonthGoldPrice from './metal_chart';
import GoldDataTable from './metal_table';
import { Snackbar } from 'react-native-paper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
});
const Metal = () => {
  return (
    <View style={[styles.body, { marginTop: 12 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AntDesign name="gold" size={24} color={colors.gold} />
        <Text
          style={{
            color: colors.gray,
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: 1.5,
          }}>
          GOLD
        </Text>
        <View
          style={{
            flexGrow: 1,
            marginRight: 4,
            height: 1.5,
            backgroundColor: colors.gray,
          }}></View>
      </View>
      <View style={{ width: '100%' }}>
        <ChartMonthGoldPrice />
        <GoldDataTable />
      </View>
    </View>
  );
};

export default Metal;
