import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { days } from '@/utils/helper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    marginTop: 20,
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

type MainBudgetProps = {
  style?: StyleProp<ViewStyle>;
};

const Today = ({ style }: MainBudgetProps) => {
  function GetToday(): Date {
    const today = new Date();
    return today;
  }
  return (
    <View style={[styles.body, style]}>
      <Text style={{ color: 'gray', letterSpacing: 2 }}> {days[GetToday().getDay()]} </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Text style={[styles.text]}>{GetToday().getDate()}</Text>
        <Text style={[styles.text, { color: 'gray' }]}>/</Text>
        <Text style={styles.text}>{GetToday().getMonth() + 1}</Text>
        <Text style={[styles.text, { color: 'gray' }]}>/</Text>
        <Text style={styles.text}>{GetToday().getFullYear()}</Text>
      </View>
    </View>
  );
};

export default Today;
