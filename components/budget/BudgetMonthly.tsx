import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'react-native-paper';
import { colors } from '@/theme';
import { Dropdown } from 'react-native-element-dropdown';
import { GetToday } from '@/utils/helper';
import { budgetEvent, GetAvailableYear, GetMonthlyBudget } from '@/local_data/data';
import { BudgetEvent } from '@/types/budget';
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

const MonthlyBudget = ({ style }: MonthlyBudgetProps) => {
  const [availableYear, setAvailableYear] = useState<{ value: number; label: string }[]>([]);
  const [selectedYear, setSelectedYear] = useState(GetToday().getFullYear());
  const [tableData, setTableData] = useState([]);
  function GetMonthBudgetByYear(budgetEvent: BudgetEvent[], selectedYear: number) {
    // const temp = GetMonthlyBudget(budgetEvent, selectedYear);
    // setTableData(temp);
    // console.log(JSON.stringify(Object.entries(temp)));
  }
  function GetYear() {
    const years: { value: number; label: string }[] = [];
    GetAvailableYear().forEach((item, index) => {
      years.push({ value: item, label: item.toString() });
    });
    setAvailableYear(years);
  }
  function UpdateData(selectedYear: number) {
    setSelectedYear(selectedYear);
    GetMonthBudgetByYear(budgetEvent, selectedYear);
  }
  useEffect(() => {
    GetYear();
    UpdateData(selectedYear);
  }, []);
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
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>
            <Text style={[styles.text]}>Month</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={[styles.text]}>Categories</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={[styles.text]}>Budget</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={[styles.text]}>Expense</Text>
          </DataTable.Title>
        </DataTable.Header>

        {/* {Object.entries(tableData).map((item: any, index: number) => (
          <DataTable.Row key={item.index}>
            <DataTable.Cell>{item.month}</DataTable.Cell>
            <DataTable.Cell>aaa</DataTable.Cell>
            <DataTable.Cell numeric>{item.expense}</DataTable.Cell>
            <DataTable.Cell numeric>{item.budget}</DataTable.Cell>
          </DataTable.Row>
        ))} */}
      </DataTable>
    </View>
  );
};

export default MonthlyBudget;
