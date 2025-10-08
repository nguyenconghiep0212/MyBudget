import { Text, View, StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from 'react-native-paper';
import { colors } from '@/theme';
import { Dropdown } from 'react-native-element-dropdown';
import { formatCurrency, GetToday, months } from '@/utils/helper';
import { GetAvailableYear, GetCategoryById, GetMonthlyBudget } from '@/local_data/data';
import { MonthlyBudget as MonthlyBudgetType } from '@/types/budget';
import MonthEdit from './monthly_Edit';
import { useFocusEffect } from 'expo-router';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    color: 'white',
  },
  inputField: {
    marginLeft: 24,
    width: '20%',
    height: 50,
  },
  placeholderStyle: {
    color: colors.lightGray,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: colors.white,
    fontSize: 16,
  },
});

type MonthlyBudgetProps = {
  style?: StyleProp<ViewStyle>;
};

type TableDataType = {
  month: number;
  categories: number[];
  expense: number;
  budget: number;
  salary: number;
};

const MonthlyBudget = ({ style }: MonthlyBudgetProps) => {
  const [selectedDate, setSelectedDate] = useState<MonthlyBudgetType>();
  const [availableYear, setAvailableYear] = useState<{ value: number; label: string }[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedYear, setSelectedYear] = useState(GetToday().getFullYear());
  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  function GetMonthBudgetByYear(selectedYear: number) {
    const temp = GetMonthlyBudget(selectedYear);
    setTableData(temp.reverse());
  }
  function GetYear() {
    const years: { value: number; label: string }[] = [];
    GetAvailableYear()
      .reverse()
      .forEach((item, index) => {
        years.push({ value: item, label: item.toString() });
      });
    setAvailableYear(years);
  }
  function UpdateData(selectedYear: number) {
    setSelectedYear(selectedYear);
    GetMonthBudgetByYear(selectedYear);
  }
  useEffect(() => {
    GetYear();
    UpdateData(selectedYear);
  }, []);
  useEffect(() => {
    UpdateData(selectedYear);
  }, [refreshFlag]);
  useFocusEffect(
    useCallback(() => {
      GetMonthBudgetByYear(selectedYear);
    }, []),
  );
  const renderItem = (item: any) => {
    return (
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 15,
          backgroundColor: colors.blackGray,
        }}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };
  return (
    <View style={[styles.body, style]}>
      <Dropdown
        style={styles.inputField}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={availableYear}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select category"
        value={selectedYear}
        renderItem={renderItem}
        onChange={item => {
          UpdateData(item.value);
        }}
      />
      <ScrollView style={{ width: '100%', marginBottom: 60 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>
              <Text style={[styles.text]}>Month</Text>
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: 'center' }}>
              <Text style={[styles.text]}>Categories</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={[styles.text]}>Expense</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={[styles.text]}>Budget</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={[styles.text]}>Income</Text>
            </DataTable.Title>
          </DataTable.Header>
          {tableData.map((item: any, index: number) => (
            <DataTable.Row
              key={index}
              style={
                selectedYear === GetToday().getFullYear() &&
                item.month === GetToday().getMonth() + 1
                  ? {
                      backgroundColor: colors.darkGray,
                    }
                  : {
                      backgroundColor: index % 2 === 0 ? colors.black : colors.blackGray,
                    }
              }
              onLongPress={() => {
                setSelectedDate({
                  month: item.month,
                  year: selectedYear,
                  amount: item.budget,
                  salary: item.salary,
                });
                setModalVisible(true);
              }}>
              <DataTable.Cell>
                <Text style={{ color: colors.lightGray, fontSize: 12 }}>
                  {months[item.month - 1]}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <View
                  style={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 8,
                  }}>
                  {item.categories.map((item2: number, index2: number) => {
                    return (
                      <View
                        key={index2}
                        style={{
                          transform: [{ scale: 0.5 }],
                          marginRight: -8,
                          marginTop: -8,
                        }}>
                        {GetCategoryById(item2)?.icon}
                      </View>
                    );
                  })}
                </View>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{ fontWeight: 200, fontSize: 10, color: colors.Negative }}>
                  {item.expense ? '-' + formatCurrency(item.expense) : '-'}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{ fontWeight: 200, fontSize: 10, color: colors.Positive }}>
                  {item.budget ? formatCurrency(item.budget) : '-'}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{ fontWeight: 200, fontSize: 10, color: colors.NavyBlueText }}>
                  {item.salary ? formatCurrency(item.salary) : '-'}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
      <MonthEdit
        selectedDate={selectedDate}
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRefreshData={() => setRefreshFlag(!refreshFlag)}
      />
    </View>
  );
};

export default MonthlyBudget;
