import { Text, View, StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import AddExpense from './addExpense';
import { Button, Divider, List, Portal } from 'react-native-paper';
import { colors } from '@/theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/helper';
import { GetCategoryById, groupSummaryData, summaryData } from '@/local_data/data';
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

type MainBudgetProps = {
  style?: StyleProp<ViewStyle>;
};

const BudgetEventTree = ({ style }: MainBudgetProps) => {
  const [groupedData, setGroupedData] = useState(groupSummaryData(summaryData));
  function ListAccordionNode(
    Date: string,
    Amount: number,
    Categories: number[],
    FontSize = 14,
  ): ReactNode {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            color: colors.lightGray,
            fontWeight: 300,
            fontSize: FontSize,
            letterSpacing: 2,
          }}>
          {Date.toUpperCase()}
        </Text>
        <Text
          style={{
            color: Amount > 0 ? colors.Positive : colors.Negative,
            fontSize: FontSize,
            letterSpacing: 2,
            fontWeight: 200,
          }}>
          {'     ' + formatCurrency(Amount)}
        </Text>
        {Categories.map((item, index: number) => {
          return (
            <View
              key={index}
              style={{ transform: [{ scale: 0.5 }], marginLeft: index > 0 ? -8 : 0 }}>
              {GetCategoryById(item)?.icon}
            </View>
          );
        })}
      </View>
    );
  }
  function IndividualEvent(data: any): ReactNode {
    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: colors.lightGray }}>{data.name}</Text>
          <Text
            style={{
              color: colors.Negative,
              fontSize: 10,
              letterSpacing: 2,
              fontWeight: 200,
              paddingLeft: 12,
            }}>
            -{formatCurrency(data.amount)}
          </Text>
          <View style={[styles.icon, { transform: [{ scale: 0.5 }] }]}>
            {GetCategoryById(data.categoryId)?.icon}
          </View>
        </View>
        <Text style={{ color: colors.gray, fontSize: 12, fontWeight: 300 }}>
          {data.description}
        </Text>
      </View>
    );
  }
  function YearlyView(data: any) {
    return Object.entries(data).map(([key, value]: any) => {
      return (
        <List.Section
          key={key}
          style={{ width: '100%', backgroundColor: colors.blackGray, padding: 0 }}>
          <List.Accordion
            title={ListAccordionNode(key, value.total, value.categoriesId)}
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
            {Object.entries(value.data)
              .reverse()
              .map(([key1, value1]: any) => {
                return (
                  <List.Accordion
                    key={key1}
                    title={ListAccordionNode('Week ' + key1, value1.total, value1.categoriesId, 12)}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon={() => (
                          <MaterialCommunityIcons
                            name="calendar-week-begin-outline"
                            size={22}
                            color={colors.lightGray}
                            style={{ marginLeft: 12 }}
                          />
                        )}
                      />
                    )}
                    style={{ backgroundColor: colors.blackGray, padding: 0 }} // Add this line
                  >
                    {Object.entries(value1.data)
                      .reverse()
                      .map(([key2, value2]: any) => {
                        return (
                          <List.Accordion
                            key={key2}
                            title={ListAccordionNode(key2, value2.total, value2.categoriesId, 11)}
                            left={props => (
                              <List.Icon
                                {...props}
                                icon={() => (
                                  <MaterialIcons
                                    name="today"
                                    size={18}
                                    color={colors.lightGray}
                                    style={{ marginLeft: 24 }}
                                  />
                                )}
                              />
                            )}
                            style={{ backgroundColor: colors.blackGray, padding: 0 }} // Add this line
                          >
                            {value2.data.map((item3: any, index3: number) => {
                              return (
                                <View key={index3}>
                                  <List.Item
                                    style={{
                                      marginVertical: 0,
                                      paddingVertical: 0,
                                    }} // outer margin/padding
                                    contentStyle={{ paddingVertical: 1 }} // inner padding
                                    title={IndividualEvent(item3)}
                                  />
                                  <Divider
                                    leftInset={true}
                                    style={{
                                      backgroundColor: colors.darkGray,
                                      marginRight: 60,
                                      marginTop: 12,
                                    }}></Divider>
                                </View>
                              );
                            })}
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
      <ScrollView style={{ width: '100%', marginBottom: 52 }}>
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
      </ScrollView>
    </View>
  );
};

export default BudgetEventTree;
