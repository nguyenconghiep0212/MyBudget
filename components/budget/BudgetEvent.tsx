import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import AddExpenseModal from './addExpense';
import { Button } from 'react-native-paper';
import { colors } from '@/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import BudgetEventTree from './budgetEvent_Tree';
import BudgetEventFlat from './budgetEvent_Flat';
import { BudgetEvent as BudgetEventType } from '@/types/budget';
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
  const [refreshFlag, setRefreshFlag] = React.useState(true);
  const [existedExpense, setExistedExpense] = React.useState<BudgetEventType>();
  const [viewMode, setViewMode] = React.useState('tree');
  return (
    <View style={[styles.body, style]}>
      <View style={[styles.superContainer, { alignItems: 'flex-end', paddingRight: 12 }]}>
        <View
          style={[styles.superItemContainer, styles.superContainer, { gap: 5, paddingLeft: 12 }]}>
          <Button
            style={{ backgroundColor: viewMode === 'tree' ? colors.NavyBlueBg : 'transparent' }}
            onPress={() => setViewMode('tree')}>
            <FontAwesome6
              name="folder-tree"
              size={14}
              color={viewMode === 'tree' ? colors.white : colors.gray}
            />
          </Button>
          <Button
            style={{ backgroundColor: viewMode === 'flat' ? colors.NavyBlueBg : 'transparent' }}
            onPress={() => setViewMode('flat')}>
            <FontAwesome6
              name="list"
              size={14}
              color={viewMode === 'flat' ? colors.white : colors.gray}
            />
          </Button>
        </View>
        <View style={[styles.superItemContainer]}>
          <Button
            mode="outlined"
            onPress={() => {
              setExistedExpense(undefined);
              setModalVisible(true);
            }}>
            <Text style={{ color: colors.lightGray }}>Add expense</Text>
          </Button>
        </View>
      </View>
      {viewMode === 'tree' ? (
        <BudgetEventTree
          refreshFlag={refreshFlag}
          onSelectBudgetEvent={event => {
            setExistedExpense(event);
            setModalVisible(true);
          }}
        />
      ) : (
        <BudgetEventFlat
          refreshFlag={refreshFlag}
          onSelectBudgetEvent={event => {
            setExistedExpense(event);
            setModalVisible(true);
          }}
        />
      )}
      <AddExpenseModal
        existedExpense={existedExpense}
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRefreshData={() => {
          setRefreshFlag(!refreshFlag);
        }}
      />
    </View>
  );
};

export default BudgetEvent;
