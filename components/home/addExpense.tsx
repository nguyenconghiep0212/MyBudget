import { Text, View, StyleSheet, StyleProp, ViewStyle, Modal, Alert, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Button, Dialog, Portal } from 'react-native-paper';
import { colors } from '@/theme';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
  },
  portal: {
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
});

type MainAddExpense = {
  modalVisible: boolean;
  onClose?: () => void;
};

const AddExpense = ({ modalVisible, onClose }: MainAddExpense) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [newExpense, setNewExpense] = useState({});
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View style={styles.body}>
      <Portal>
        <Dialog visible={modalVisible} style={styles.portal} onDismiss={onClose}>
          <Dialog.Title style={[styles.text, { color: colors.lightGray }]}>
            Add new expense
          </Dialog.Title>
          <Dialog.Content style={styles.portalBody}>
            <View></View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onClose}>
              <Text style={{ color: colors.Negative }}>Cancel</Text>
            </Button>
            <Button onPress={onClose}>
              <Text style={{ color: colors.NavyBlueText }}>Confirm</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default AddExpense;
