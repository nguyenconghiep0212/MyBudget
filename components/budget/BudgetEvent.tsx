import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import AddExpense from './addExpense';
import { Button } from 'react-native-paper';
import { colors } from '@/theme';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    color: 'white',
  },
});

type MainBudgetProps = {
  style?: StyleProp<ViewStyle>;
};

const BudgetEvent = ({ style }: MainBudgetProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.body, style]}>
      <Button mode="outlined" onPress={() => setModalVisible(true)}>
        <Text style={{ color: colors.lightGray }}>Add expense</Text>
        {/* <Octicons name="plus" size={24} color="gray" /> */}
      </Button>
      <AddExpense modalVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default BudgetEvent;
