import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import AddExpense from './addExpense';
import { Button, Divider, List, Portal } from 'react-native-paper';
import { colors } from '@/theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/helper';
import { groupSummaryData, summaryData } from '@/local_data/data';
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
  const [groupedData, setGroupedData] = useState(groupSummaryData(summaryData));
  console.log(JSON.stringify(groupedData));
  function ListAccordionNode(Date: string, Amount: number, FontSize = 14): ReactNode {
    return (
      <View>
        <Text
          style={{
            color: colors.lightGray,
            fontWeight: 300,
            fontSize: FontSize,
            letterSpacing: 2,
          }}>
          {Date.toUpperCase()}
          <Text
            style={{
              color: Amount > 0 ? colors.Positive : colors.Negative,
              letterSpacing: 2,
              fontWeight: 200,
            }}>
            {'          ' + formatCurrency(Amount)}
          </Text>
        </Text>
      </View>
    );
  }
  function YearlyView(data: any) {
    // console.log(data);
    return Object.entries(data).map(([key, value]: any) => {
      return (
        <List.Section
          key={key}
          style={{ width: '100%', backgroundColor: colors.blackGray, padding: 0 }}>
          <List.Accordion
            title={ListAccordionNode(key, value.total)}
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
            {Object.entries(value.data).map(([key1, value1]: any) => {
              return (
                <List.Accordion
                  key={key1}
                  title={ListAccordionNode('Week ' + key1, value1.total, 12)}
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
                  {/* <Text style={{ color: 'white' }}>
                    {JSON.stringify(Object.entries(value1.data)[0])}
                  </Text> */}
                  {Object.entries(value1.data).map(([key2, value2]: any) => {
                    return (
                      <List.Accordion
                        key={key2}
                        title={ListAccordionNode(key2, value2.total)}
                        left={props => (
                          <List.Icon
                            {...props}
                            icon={() => (
                              <MaterialIcons
                                name="today"
                                size={24}
                                color={colors.lightGray}
                                style={{ marginLeft: 48 }}
                              />
                            )}
                          />
                        )}
                        style={{ backgroundColor: colors.blackGray, padding: 0 }} // Add this line
                      >
                        <Text>{key2}</Text>
                        <List.Item
                          title="Second item"
                          titleStyle={{ color: 'white', marginLeft: 24 }}
                        />
                      </List.Accordion>
                    );
                  })}
                </List.Accordion>
              );
            })}
          </List.Accordion>
        </List.Section>
      );
    });
  }
  return (
    <View style={[styles.body, style]}>
      <View style={[styles.body, { alignItems: 'flex-end', paddingRight: 12 }]}>
        <Button mode="outlined" onPress={() => setModalVisible(true)}>
          <Text style={{ color: colors.lightGray }}>Add expense</Text>
        </Button>
      </View>
      {Object.entries(groupedData).map(([key, value]: any) => (
        <View style={[styles.body, { marginTop: 12 }]} key={key}>
          <View
            style={{
              paddingLeft: 18,
              paddingRight: 28,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.text,
                { color: colors.lightGray, fontSize: 24, fontWeight: 300, letterSpacing: 6 },
              ]}>
              {key}
            </Text>
            <View
              style={{ marginLeft: 12, backgroundColor: colors.gray, flex: 1, height: 2 }}></View>
          </View>
          {YearlyView(value.data)}
        </View>
      ))}
      <AddExpense modalVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default BudgetEvent;
