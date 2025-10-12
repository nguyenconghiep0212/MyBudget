import { colors } from '@/theme';
import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
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
});
type ConfirmationProps = {
  style?: StyleProp<ViewStyle>;
  modalOption: {
    title: string;
    body: ReactNode;
  };
  modalVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const Confirmation = ({
  modalOption,
  style,
  modalVisible,
  onClose,
  onConfirm,
}: ConfirmationProps) => {
  return (
    <View>
      <Portal>
        <Dialog style={styles.portal} visible={modalVisible} onDismiss={onClose}>
          <Dialog.Title>
            <View>
              <Text style={{ color: colors.gray, fontSize: 18 }}>{modalOption.title}</Text>
            </View>
          </Dialog.Title>
          <Dialog.Content style={styles.portalBody}>{modalOption.body}</Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onClose}>
              <Text style={{ color: colors.Negative }}>Cancel</Text>
            </Button>
            <Button onPress={onConfirm}>
              <Text style={{ color: colors.NavyBlueText }}>Confirm</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default Confirmation;
