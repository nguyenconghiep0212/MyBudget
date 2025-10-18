import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { Button, Checkbox } from 'react-native-paper';
import { AntDesign, FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  CopyBudgetFileToExternalStorage,
  CopyExpenseFileToExternalStorage,
  CopyGoldFileToExternalStorage,
  ReadExpenseFileFromExternalStorage,
  ReadGoldFileFromExternalStorage,
  ReadBudgetFileFromExternalStorage,
  ResetAllData,
} from '@/services/file.service';
import { useState } from 'react';
import { useBudgetSlice } from '@/slices';

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
  const { dispatch, RefreshDataFiles } = useBudgetSlice();
  const DownloadView = () => {
    return (
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="download" size={24} color={colors.lightGray} />
          <Text
            style={{
              color: colors.lightGray,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}>
            Export data
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
              <FontAwesome6 name="money-bill-transfer" size={24} color={colors.Negative} />
              <Text style={{ color: colors.Negative, fontWeight: 700, letterSpacing: 1 }}>
                Expenses File
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
                Assets File
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
                Budget File
              </Text>
            </View>
          </Button>
        </View>
      </View>
    );
  };
  const UploadView = () => {
    async function SaveExpenseFromFile() {
      const res = await ReadExpenseFileFromExternalStorage();
      if (res) {
        dispatch(RefreshDataFiles());
      }
    }
    async function SaveGoldFromFile() {
      const res = await ReadGoldFileFromExternalStorage();
      if (res) {
        dispatch(RefreshDataFiles());
      }
    }
    async function SaveBudgetFromFile() {
      const res = await ReadBudgetFileFromExternalStorage();
      if (res) {
        dispatch(RefreshDataFiles());
      }
    }
    return (
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="content-save-edit" size={24} color={colors.lightGray} />
          <Text
            style={{
              color: colors.lightGray,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}>
            Import data
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
            onPress={SaveExpenseFromFile}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
              <FontAwesome6 name="money-bill-transfer" size={24} color={colors.Negative} />
              <Text style={{ color: colors.Negative, fontWeight: 700, letterSpacing: 1 }}>
                Expenses File
              </Text>
            </View>
          </Button>
          <Button
            style={{ width: '100%' }}
            mode="contained-tonal"
            buttonColor={colors.darkGray}
            onPress={SaveGoldFromFile}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AntDesign name="gold" size={24} color={colors.gold} />
              <Text style={{ color: colors.gold, fontWeight: 700, letterSpacing: 1 }}>
                Assets File
              </Text>
            </View>
          </Button>
          <Button
            style={{ width: '100%' }}
            mode="contained-tonal"
            buttonColor={colors.darkGray}
            onPress={SaveBudgetFromFile}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AntDesign name="wallet" size={24} color={colors.NavyBlueText} />
              <Text style={{ color: colors.NavyBlueText, fontWeight: 700, letterSpacing: 1 }}>
                Budget File
              </Text>
            </View>
          </Button>
        </View>
      </View>
    );
  };
  const ResetView = () => {
    const [checked, setChecked] = useState(false);
    async function ResetData() {
      if (checked) {
        const res = await ResetAllData();
        if (res) {
          dispatch(RefreshDataFiles());
        }
        setChecked(false);
      }
    }
    return (
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="file-document-refresh" size={24} color={colors.cordovan} />
          <Text
            style={{
              color: colors.cordovan,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}>
            Reset data
          </Text>
          <View
            style={{
              flexGrow: 1,
              marginRight: 4,
              height: 1.5,
              backgroundColor: colors.cordovan,
            }}></View>
        </View>
        <View style={{ marginTop: 12, ...styles.root, width: '100%' }}>
          <Button
            style={{ width: '100%' }}
            mode="contained"
            buttonColor={colors.darkerGray}
            onLongPress={ResetData}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="archive-refresh" size={24} color={colors.cordovan} />
              <Text
                style={{
                  color: colors.cordovan,
                  fontWeight: 800,
                  textDecorationLine: 'underline',
                  letterSpacing: 1,
                }}>
                Hold to reset
              </Text>
            </View>
          </Button>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              color={colors.cordovan}
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Text
              style={{
                color: colors.cordovan,
                fontWeight: 800,
                textDecorationLine: 'underline',
                letterSpacing: 1,
              }}>{`I know what i'm doing !`}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <View style={[styles.root, { padding: 24, height: '100%', gap: 32 }]}>
        <DownloadView />
        <UploadView />
        <ResetView />
      </View>
    </SafeAreaView>
  );
}
