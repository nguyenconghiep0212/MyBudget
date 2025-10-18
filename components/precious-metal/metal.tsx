import { colors } from '@/theme';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import ChartMonthGoldPrice from './metal_chart';
import GoldDataTable from './metal_table';
import { useState } from 'react';
import MetalTabs from './metal_tabs';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
  superContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabTitle: {
    letterSpacing: 1,
    fontSize: 16,
    fontWeight: 700,
  },
});
const Metal = () => {
  const [view, setView] = useState<'market' | 'myAssets'>('market');
  const Header = () => {
    return (
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
    );
  };
  return (
    <View style={[styles.body, { marginTop: 12 }]}>
      {/* <Header /> */}
      <View style={styles.superContainer}>
        <TouchableOpacity
          style={[
            styles.superItemContainer,
            {
              backgroundColor: colors.blackGray,
              borderBottomWidth: view === 'market' ? 2 : 0,
              borderColor: colors.NavyBlueBg,
            },
          ]}
          onPress={() => setView('market')}>
          <Text
            style={[
              styles.tabTitle,
              { color: view === 'market' ? colors.NavyBlueText : colors.lightGray },
            ]}>
            Market Price
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.superItemContainer,
            {
              backgroundColor: colors.blackGray,
              borderBottomWidth: view === 'myAssets' ? 2 : 0,
              borderColor: colors.NavyBlueBg,
            },
          ]}
          onPress={() => setView('myAssets')}>
          <Text
            style={[
              styles.tabTitle,
              { color: view === 'myAssets' ? colors.NavyBlueText : colors.lightGray },
            ]}>
            My Assets
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: '100%' }}>
        {view === 'market' ? (
          <View>
            <ChartMonthGoldPrice />
            <MetalTabs />
          </View>
        ) : (
          <GoldDataTable />
        )}
      </View>
    </View>
  );
};

export default Metal;
