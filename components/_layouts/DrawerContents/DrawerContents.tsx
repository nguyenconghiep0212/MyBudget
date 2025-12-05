import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cateroryColors, colors } from '@/theme';
import { Button, Checkbox } from 'react-native-paper';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ResetAllData,
  ReadDataFromExternalStorage,
  CopyDataToExternalStorage,
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
            mode="contained-tonal"
            buttonColor={colors.darkGray}
            onPress={CopyDataToExternalStorage}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome name="download" size={24} color={colors.NavyBlueText} />
              <Text style={{ color: colors.NavyBlueText, fontWeight: 700, letterSpacing: 1 }}>
                Export data
              </Text>
            </View>
          </Button>
        </View>
      </View>
    );
  };
  const UploadView = () => {
    async function SaveDataFromFile() {
      const res = await ReadDataFromExternalStorage();
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
            mode="contained-tonal"
            buttonColor={colors.darkGray}
            onPress={SaveDataFromFile}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="content-save-edit" size={24} color={colors.Positive} />
              <Text style={{ color: colors.Positive, fontWeight: 700, letterSpacing: 1 }}>
                Import data
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
          <MaterialCommunityIcons
            name="file-document-refresh"
            size={24}
            color={cateroryColors.cordovan}
          />
          <Text
            style={{
              color: cateroryColors.cordovan,
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
              backgroundColor: cateroryColors.cordovan,
            }}></View>
        </View>
        <View style={{ marginTop: 12, ...styles.root, width: '100%' }}>
          <Button
            style={{ width: '100%' }}
            mode="contained"
            buttonColor={colors.darkerGray}
            onLongPress={ResetData}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons
                name="gesture-tap-hold"
                size={24}
                color={cateroryColors.cordovan}
              />
              <Text
                style={{
                  color: cateroryColors.cordovan,
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
              color={cateroryColors.cordovan}
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Text
              style={{
                color: cateroryColors.cordovan,
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
      <View style={[styles.root]}>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            paddingHorizontal: 24,
          }}>
          <Text style={{ fontSize: 12, color: colors.darkGray }}>v1.1.1</Text>
        </View>
        <View style={{ paddingHorizontal: 24, height: '100%', width: '100%', gap: 32 }}>
          <DownloadView />
          <UploadView />
          <ResetView />
        </View>
      </View>
    </SafeAreaView>
  );
}
