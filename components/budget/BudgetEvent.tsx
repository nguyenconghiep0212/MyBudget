import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import AddExpense from './addExpense';
import { Button, List } from 'react-native-paper';
import { colors } from '@/theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/helper';
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
});

type MainBudgetProps = {
  style?: StyleProp<ViewStyle>;
};

const BudgetEvent = ({ style }: MainBudgetProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);
  function ListAccordionNode(Date: string, Amount: number): ReactNode {
    return (
      <View style={[styles.superContainer]}>
        <View style={styles.superItemContainer}>
          <Text style={{ color: colors.lightGray }}>{Date}</Text>
        </View>
        <View style={[styles.superItemContainer, { alignItems: 'flex-end' }]}>
          <Text style={{ color: Amount > 0 ? colors.Positive : colors.Negative }}>
            {formatCurrency(Amount)}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.body, style]}>
      <View style={[styles.body, { alignItems: 'flex-end', paddingRight: 12 }]}>
        <Button mode="outlined" onPress={() => setModalVisible(true)}>
          <Text style={{ color: colors.lightGray }}>Add expense</Text>
        </Button>
      </View>
      {isReady && (
        <List.Section style={{ width: '100%', backgroundColor: colors.blackGray, padding: 0 }}>
          <List.Accordion
            title={ListAccordionNode('Sep 2025', -2_300_000)}
            left={props => (
              <List.Icon
                {...props}
                icon={() => (
                  <MaterialIcons name="calendar-month" size={24} color={colors.lightGray} />
                )}
              />
            )}
            style={{ backgroundColor: colors.blackGray, padding: 0 }} // Add this line
          >
            <List.Accordion
              title={ListAccordionNode('Week 1', 120_000)}
              left={props => (
                <List.Icon
                  {...props}
                  icon={() => (
                    <MaterialCommunityIcons
                      name="calendar-week-begin-outline"
                      size={24}
                      color={colors.lightGray}
                      style={{ marginLeft: 24 }}
                    />
                  )}
                />
              )}
              style={{ backgroundColor: colors.blackGray, padding: 0 }} // Add this line
            >
              <List.Item title="Second item" titleStyle={{ color: 'white', marginLeft: 24 }} />
            </List.Accordion>
          </List.Accordion>
        </List.Section>
      )}
      <AddExpense modalVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default BudgetEvent;
