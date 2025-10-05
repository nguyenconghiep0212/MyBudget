import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import AddExpense from './addExpense';
import { Button } from 'react-native-paper';
import { colors } from '@/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import BudgetEventTree from './BudgetEvent_Tree';
import BudgetEventFlat from './BudgetEvent_Flat';
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
  superContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
  },
  icon: {
    transform: [{ scale: 0.8 }],
    marginTop: 4,
    padding: 6,
  },
});

type BudgetEventProps = {
  style?: StyleProp<ViewStyle>;
};

const BudgetEvent = ({ style }: BudgetEventProps) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('tree');
  return (
    <View style={[styles.body, style]}>
      <View style={[styles.superContainer, { alignItems: 'flex-end', paddingRight: 12 }]}>
        <View
          style={[styles.superItemContainer, styles.superContainer, { gap: 5, paddingLeft: 12 }]}>
          <Button
            style={{ backgroundColor: viewMode === 'tree' ? colors.NavyBlueBg : 'transparent' }}
            onPress={() => setViewMode('tree')}>
            <FontAwesome6 name="folder-tree" size={14} color={colors.gray} />
          </Button>
          <Button
            style={{ backgroundColor: viewMode === 'flat' ? colors.NavyBlueBg : 'transparent' }}
            onPress={() => setViewMode('flat')}>
            <FontAwesome6 name="list" size={14} color={colors.gray} />
          </Button>
        </View>
        <View style={[styles.superItemContainer]}>
          <Button mode="outlined" onPress={() => setModalVisible(true)}>
            <Text style={{ color: colors.lightGray }}>Add expense</Text>
          </Button>
        </View>
      </View>
      {viewMode === 'tree' ? <BudgetEventTree /> : <BudgetEventFlat />}
      <AddExpense modalVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default BudgetEvent;
