import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { days, GetToday } from '@/utils/helper';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useBudgetSlice } from '@/slices';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 500,
    color: 'white',
  },
});

type TodayProps = {
  style?: StyleProp<ViewStyle>;
};

const Today = ({ style }: TodayProps) => {
  const { dispatch, yearSummery, ChangeYearSummery } = useBudgetSlice();
  function loadPreviousYear() {
    dispatch(ChangeYearSummery(yearSummery - 1));
  }
  function loadNextYear() {
    dispatch(ChangeYearSummery(yearSummery + 1));
  }
  return (
    <View style={[styles.body, style]}>
      <View style={{ position: 'absolute', right: 0 }}>
        <FontAwesome name="chevron-right" size={24} color={colors.gray} onPress={loadNextYear} />
      </View>
      <View style={{ position: 'absolute', left: 0 }}>
        <FontAwesome name="chevron-left" size={24} color={colors.gray} onPress={loadPreviousYear} />
      </View>
      {yearSummery !== GetToday().getFullYear() || (
        <Text style={{ color: 'gray', letterSpacing: 2 }}> {days[GetToday().getDay()]} </Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        {yearSummery !== GetToday().getFullYear() ? (
          <>
            <Text style={styles.text}>{yearSummery}</Text>
          </>
        ) : (
          <>
            <Text style={[styles.text]}>{GetToday().getDate()}</Text>
            <Text style={[styles.text, { color: 'gray' }]}>/</Text>
            <Text style={styles.text}>{GetToday().getMonth() + 1}</Text>
            <Text style={[styles.text, { color: 'gray' }]}>/</Text>
            <Text style={styles.text}>{GetToday().getFullYear()}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default Today;
