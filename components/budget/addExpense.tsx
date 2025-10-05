import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Button, Dialog, Divider, Portal } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '@/theme';
import { expenseCategory } from '@/local_data/data';
import { ExpenseEvent } from '@/types/budget';
import Today from '@/components/common/date';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { GetToday } from '@/utils/helper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  text: {
    color: colors.white,
  },
  portal: {
    marginTop: -70,
    fontSize: 28,
    fontWeight: 500,
    backgroundColor: colors.blackGray,
  },
  portalBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Dropdown styles
  inputField: {
    width: '100%',
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
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

type MainAddExpense = {
  modalVisible: boolean;
  onClose?: () => void;
};
const AddExpense = ({ modalVisible, onClose }: MainAddExpense) => {
  const [date, setDate] = useState(new Date());
  const [newExpense, setNewExpense] = useState<ExpenseEvent>({
    id: new Date().getTime(), // Unique ID based on timestamp
    name: '',
    description: '',
    amount: 0,
    date: GetToday(), // Fixed
    typeId: 2, // Fixed
    expenseCategoryId: 0,
  });
  const [value, setValue] = useState(null);
  function onAddExpense() {
    console.log('Adding expense:', newExpense);
    onClose;
  }
  function OpenTimePicker() {
    console.log('open');
    DateTimePickerAndroid.open({
      value: newExpense.date,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setNewExpense({ ...newExpense, date: selectedDate });
        }
      },
      mode: 'date', // or 'time'
      is24Hour: true,
    });
  }
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
        <Text style={styles.selectedTextStyle}>{item.name}</Text>
        {item.icon}
      </View>
    );
  };
  return (
    <View style={styles.body}>
      <Portal>
        <Dialog visible={modalVisible} style={styles.portal} onDismiss={onClose}>
          {/* <Dialog.Title style={[styles.text, { color: colors.lightGray }]}>
            Add new expense
          </Dialog.Title> */}
          <Dialog.Content style={styles.portalBody}>
            <Text
              style={[styles.text, { fontSize: 24, color: colors.lightGray, marginBottom: 20 }]}>
              Add new expense
            </Text>
            <View
              style={[
                styles.superContainer,
                {
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                },
              ]}>
              <Text style={[styles.text, { color: colors.lightGray, fontSize: 18 }]}>
                {newExpense.date.toDateString()}
              </Text>
              <Button onPress={OpenTimePicker}>
                <FontAwesome name="calendar" size={20} color={colors.lightGray} />
              </Button>
            </View>
            <View style={{ width: '100%' }}>
              <TextInput
                placeholderTextColor={colors.lightGray}
                placeholder="Name"
                style={[styles.inputField, { color: 'white' }]}
                onSubmitEditing={event => () => {
                  setNewExpense({ ...newExpense, name: event.nativeEvent.text });
                }}
              />
              <TextInput
                placeholderTextColor={colors.lightGray}
                placeholder="Description (optional)"
                style={[styles.inputField, { color: 'white' }]}
                onSubmitEditing={event => () => {
                  setNewExpense({ ...newExpense, description: event.nativeEvent.text });
                }}
              />
              <Dropdown
                style={styles.inputField}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={expenseCategory}
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder="Select category"
                value={newExpense.expenseCategoryId}
                renderItem={renderItem}
                onChange={item => {
                  setNewExpense({ ...newExpense, expenseCategoryId: item.id });
                }}
              />
              <TextInput
                placeholderTextColor={colors.lightGray}
                placeholder="Input amount"
                style={[styles.inputField, { color: 'white' }]}
                keyboardType="numeric"
                onSubmitEditing={event => () => {
                  console.log(event.nativeEvent.text);
                  setNewExpense({
                    ...newExpense,
                    amount: event.nativeEvent.text as unknown as number,
                  });
                }}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onClose}>
              <Text style={{ color: colors.Negative }}>Cancel</Text>
            </Button>
            <Button onPress={onAddExpense}>
              <Text style={{ color: colors.NavyBlueText }}>Confirm</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default AddExpense;
