import { Button, Dialog, Portal } from 'react-native-paper';
import { StyleProp, View, ViewStyle, StyleSheet, Text, TextInput } from 'react-native';
import { colors } from '@/theme';
import { months } from '@/utils/helper';
import { useEffect, useState } from 'react';
import { MonthlyBudget } from '@/types/budget';
import { SetMonthlyBudget } from '@/local_data/data';

type MonthEditProps = {
  style?: StyleProp<ViewStyle>;
  modalVisible: boolean;
  selectedDate?: MonthlyBudget;
  onClose: () => void;
  onRefreshData: () => void;
};
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
});
const MonthEdit = ({
  selectedDate,
  modalVisible,
  style,
  onClose,
  onRefreshData,
}: MonthEditProps) => {
  const [monthBudget, setMonthBudget] = useState<MonthlyBudget>();
  function onEditonEditMonthBudget() {
    if (monthBudget) {
      SetMonthlyBudget(monthBudget);
      onRefreshData();
      onClose();
    }
  }
  function SetMonthBudget() {
    if (selectedDate) {
      setMonthBudget(selectedDate);
    }
  }
  useEffect(() => {
    SetMonthBudget();
  }, [selectedDate]);
  return (
    <View style={[styles.body, style]}>
      <Portal>
        <Dialog visible={modalVisible} style={styles.portal} onDismiss={onClose}>
          <Dialog.Content style={styles.portalBody}>
            <Text
              style={[styles.text, { fontSize: 24, color: colors.lightGray, marginBottom: 20 }]}>
              Edit {months[selectedDate ? selectedDate.month - 1 : 0]} budget
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
              {monthBudget && (
                <View style={{ width: '100%' }}>
                  <View>
                    <Text style={{ color: colors.lightGray, fontSize: 18, fontWeight: 300 }}>
                      Budget:
                    </Text>
                    <TextInput
                      placeholderTextColor={colors.darkGray}
                      placeholder="Enter budget..."
                      style={[styles.inputField, { color: 'white' }]}
                      value={monthBudget.amount ? monthBudget.amount.toString() : ''}
                      keyboardType="numeric"
                      onChangeText={event => {
                        setMonthBudget({
                          ...monthBudget,
                          amount: parseFloat(event) as unknown as number,
                        });
                      }}
                    />
                  </View>
                  <View style={{ marginTop: 24 }}>
                    <Text
                      style={{
                        color: colors.lightGray,
                        fontSize: 18,
                        fontWeight: 300,
                      }}>
                      Income:
                    </Text>
                    <TextInput
                      placeholderTextColor={colors.darkGray}
                      placeholder="Enter income..."
                      style={[styles.inputField, { color: 'white' }]}
                      value={monthBudget.salary ? monthBudget.salary.toString() : ''}
                      keyboardType="numeric"
                      onChangeText={event => {
                        setMonthBudget({
                          ...monthBudget,
                          salary: parseFloat(event) as unknown as number,
                        });
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onClose}>
              <Text style={{ color: colors.Negative }}>Cancel</Text>
            </Button>
            <Button onPress={onEditonEditMonthBudget}>
              <Text style={{ color: colors.NavyBlueText }}>Confirm</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
export default MonthEdit;
