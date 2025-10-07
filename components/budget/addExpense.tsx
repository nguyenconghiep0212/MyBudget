import { Text, View, StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Button, Dialog, Portal } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '@/theme';
import { DeleteExpense, EditExpense, AddExpense, expenseCategory } from '@/local_data/data';
import { BudgetEvent } from '@/types/budget';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { formatCurrency, GetToday } from '@/utils/helper';
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
  existedExpense?: BudgetEvent;
  modalVisible: boolean;
  onClose: () => void;
  onRefreshData: () => void;
};
const AddExpenseModal = ({
  existedExpense,
  modalVisible,
  onClose,
  onRefreshData,
}: MainAddExpense) => {
  const defaultExpense = {
    id: new Date().getTime().toString(), // Unique ID based on timestamp
    name: '',
    description: '',
    amount: 0,
    date: GetToday(), // Fixed
    categoryId: 0,
  };
  const [newExpense, setNewExpense] = useState<BudgetEvent>(defaultExpense);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  function checkEditExpense() {
    if (existedExpense) {
      setNewExpense(existedExpense);
      setIsEdit(true);
    } else {
      setNewExpense(defaultExpense);
      setIsEdit(false);
    }
  }
  function onEditExpense() {
    if (newExpense) EditExpense(newExpense);
    onClose();
    onRefreshData();
  }
  function onAddExpense() {
    if (newExpense) AddExpense(newExpense);
    onClose();
    onRefreshData();
  }
  function onDeleteExpense() {
    if (existedExpense) DeleteExpense(existedExpense.id);
    onClose();
    onRefreshData();
  }
  function OpenTimePicker() {
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
  useEffect(() => {
    checkEditExpense();
  }, [existedExpense]);
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
              {isEdit ? 'Edit expense' : 'Add new expense'}
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
                value={newExpense.name}
                style={[styles.inputField, { color: 'white' }]}
                onChangeText={event => {
                  setNewExpense({ ...newExpense, name: event });
                }}
              />
              <TextInput
                placeholderTextColor={colors.lightGray}
                placeholder="Description (optional)"
                value={newExpense.description}
                style={[styles.inputField, { color: 'white' }]}
                onChangeText={event => {
                  setNewExpense({ ...newExpense, description: event });
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
                value={newExpense.categoryId}
                renderItem={renderItem}
                onChange={item => {
                  setNewExpense({ ...newExpense, categoryId: item.id });
                }}
              />
              <TextInput
                placeholderTextColor={colors.lightGray}
                placeholder="Input amount"
                style={[styles.inputField, { color: 'white' }]}
                value={newExpense.amount ? newExpense.amount.toString() : ''}
                keyboardType="numeric"
                onChangeText={event => {
                  console.log(event);
                  setNewExpense({
                    ...newExpense,
                    amount: parseFloat(event) as unknown as number,
                  });
                }}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <View style={styles.superContainer}>
              <View style={[styles.superItemContainer, { alignItems: 'flex-start' }]}>
                {isEdit && (
                  <Button mode="text" compact onPress={onDeleteExpense}>
                    <Ionicons name="trash-bin" size={18} color={colors.Negative} />
                  </Button>
                )}
              </View>
              <View style={[styles.superItemContainer, { flexDirection: 'row' }]}>
                <Button onPress={onClose}>
                  <Text style={{ color: colors.Negative }}>Cancel</Text>
                </Button>
                <Button onPress={isEdit ? onEditExpense : onAddExpense}>
                  <Text style={{ color: colors.NavyBlueText }}>{isEdit ? 'Edit' : 'Add'}</Text>
                </Button>
              </View>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default AddExpenseModal;
