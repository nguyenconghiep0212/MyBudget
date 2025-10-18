import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { Button } from 'react-native-paper';
import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import {
  CopyBudgetFileToExternalStorage,
  CopyExpenseFileToExternalStorage,
  CopyGoldFileToExternalStorage,
} from '@/services/file.service';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.blackGray,
    gap: 8,
  },
});

export default function DrawerContents() {
  const { isDark } = useColorScheme();
  const UploadView = () => {
    return (
      <>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome5 name="cloud-upload-alt" size={24} color={colors.lightGray} />
          <Text
            style={{
              color: colors.lightGray,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}>
            Upload files
          </Text>
          <View
            style={{
              flexGrow: 1,
              marginRight: 4,
              height: 1.5,
              backgroundColor: colors.gray,
            }}></View>
        </View>
        <View style={{ marginTop: 12, ...styles.root, width: '100%' }}>
          <Button
            style={{ width: '100%' }}
            mode="contained"
            buttonColor={colors.darkGray}
            onPress={CopyExpenseFileToExternalStorage}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome6 name="money-bill-transfer" size={24} color={colors.Negative} />
              <Text style={{ color: colors.Negative, fontWeight: 700, letterSpacing: 1 }}>
                Share Expenses File
              </Text>
            </View>
          </Button>
          <Button
            style={{ width: '100%' }}
            mode="contained-tonal"
            buttonColor={colors.darkGray}
            onPress={CopyGoldFileToExternalStorage}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AntDesign name="gold" size={24} color={colors.gold} />
              <Text style={{ color: colors.gold, fontWeight: 700, letterSpacing: 1 }}>
                Share Assets File
              </Text>
            </View>
          </Button>
          <Button
            style={{ width: '100%' }}
            mode="contained-tonal"
            buttonColor={colors.darkGray}
            onPress={CopyBudgetFileToExternalStorage}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AntDesign name="wallet" size={24} color={colors.NavyBlueText} />
              <Text style={{ color: colors.NavyBlueText, fontWeight: 700, letterSpacing: 1 }}>
                Share Budget File
              </Text>
            </View>
          </Button>
        </View>
      </>
    );
  };
  const OptionView = () => {
    return (
      <>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="gear" size={24} color={colors.lightGray} />
          <Text
            style={{
              color: colors.lightGray,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}>
            Configuration
          </Text>
          <View
            style={{
              flexGrow: 1,
              marginRight: 4,
              height: 1.5,
              backgroundColor: colors.gray,
            }}></View>
        </View>
        <View style={{ marginTop: 12, ...styles.root, width: '100%' }}>
          <Button
            style={{ width: '100%' }}
            mode="contained"
            buttonColor={colors.darkGray}
            onPress={CopyExpenseFileToExternalStorage}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome6 name="money-bill-transfer" size={24} color={colors.Negative} />
              <Text style={{ color: colors.Negative, fontWeight: 700, letterSpacing: 1 }}>
                Share Expenses File
              </Text>
            </View>
          </Button>
        </View>
      </>
    );
  };
  return (
    <SafeAreaView>
      <View style={[styles.root, { padding: 24, height: '100%', gap: 32 }]}>
        <UploadView />
        <OptionView />
      </View>
    </SafeAreaView>
  );
}
