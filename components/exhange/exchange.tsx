import {
  fetchVPBankExchangeRate,
  fetchBIDVBankExchangeRate,
  fetchVietcomBankExchangeRate,
} from '@/services/exchange.service';
import { colors } from '@/theme';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleProp, View, Image, ViewStyle, TextInput, StyleSheet, Text } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useExchangeSlice } from '@/slices/exchange.slice';
import { Dropdown } from 'react-native-element-dropdown';
import { Entypo } from '@expo/vector-icons';
import { showAlert } from '@/utils/helper';
const styles = StyleSheet.create({
  inputField: {
    width: '100%',
    height: 40,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: colors.blackGray,
    color: colors.white,
  },
  superContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  superItemContainer: {
    display: 'flex',
    width: '45%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
  },
  dropdownField: {
    width: '100%',
    height: 30,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.blackGray,
  },
  placeholderStyle: {
    color: colors.lightGray,
    fontSize: 14,
  },
  selectedTextStyle: {
    color: colors.white,
    fontWeight: 700,
    fontSize: 18,
  },
});
type ExchangeProps = {
  style?: StyleProp<ViewStyle>;
};
enum BANKENUM {
  VIETCOMBANK = 'vietcombank',
  BIDV = 'bidv',
  VPBANK = 'vpbank',
}
const Exchange = ({ style }: ExchangeProps) => {
  const {
    dispatch,
    DataApiLoading,
    DataApiLoaded,
    refreshExchangeRate,
    lastUpdateTime,
    SetVPBankExchangeRate,
    SetBIDVBankExchangeRate,
    SetVietcomBankExchangeRate,
    SetSelectedBank,
  } = useExchangeSlice();
  const [exchangeNumber, setExchangeNumber] = useState<number>(0);
  const [exchangedNumber, setExchangedNumber] = useState<number>(0);
  const [exchangeRateFrom, setExchangeRateFrom] = useState<number[]>([]);
  const [exchangeRateTo, setExchangeRateTo] = useState<number[]>([]);
  const [selectedExchangeRateFrom, setSelectedExchangeRateFrom] = useState<number>(1);
  const [selectedExchangeRateTo, setSelectedExchangeRateTo] = useState<number>(1);
  const [selectedBank, setSelectedBank] = useState<string>(BANKENUM.VIETCOMBANK);
  const bankLogoPath = '@/assets/images/banks/';
  async function getVPBankExchange() {
    const res = await fetchVPBankExchangeRate();
    if (res) {
      dispatch(SetVPBankExchangeRate(res[0]));
    }
  }
  async function getBIDVBankExchange() {
    const res = await fetchBIDVBankExchangeRate();
    if (res) {
      dispatch(SetBIDVBankExchangeRate(res));
    }
  }
  async function getVietcomBankExchange() {
    const res = await fetchVietcomBankExchangeRate();
    if (res) {
      dispatch(SetVietcomBankExchangeRate(res));
    }
  }

  function onSelectedBank(bank: string) {
    setSelectedBank(bank);
    if (bank === BANKENUM.VIETCOMBANK) {
      dispatch(SetSelectedBank(bank));
    }
    if (bank === BANKENUM.VPBANK) {
      dispatch(SetSelectedBank(bank));
    }
    if (bank === BANKENUM.BIDV) {
      dispatch(SetSelectedBank(bank));
    }
  }

  function submitExchangeCurrency(number: number) {
    setExchangedNumber(number);
  }
  useFocusEffect(
    useCallback(() => {
      console.log('Fetching exchange rate data...');
      dispatch(DataApiLoading());
      Promise.all([getVPBankExchange(), getBIDVBankExchange(), getVietcomBankExchange()])
        .then(() => {
          dispatch(DataApiLoaded());
          console.log('Fetching exchange rate data succeeded.');
        })
        .catch(error => {
          showAlert('Network Error', 'Please check your Wifi/4G connection and try again.');
          dispatch(DataApiLoaded());
        });
    }, [refreshExchangeRate]),
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
        <Text style={styles.selectedTextStyle}>{item.rate}</Text>
      </View>
    );
  };

  return (
    <View style={[style, { width: '100%' }]}>
      <Text style={{ color: colors.gray, marginVertical: 8, fontSize: 12 }}>
        * Bank exchange rates are for reference only and may vary *
      </Text>
      <SegmentedButtons
        theme={{
          colors: {
            secondaryContainer: colors.NavyBlueBg,
            onSecondaryContainer: 'white',
            onSurface: 'white',
          },
        }}
        value={selectedBank}
        onValueChange={event => {
          onSelectedBank(event);
        }}
        buttons={[
          {
            value: BANKENUM.VIETCOMBANK,
            label: '',
            icon() {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}>
                  <Image
                    source={require(`${bankLogoPath}VietcomBank.webp`)}
                    style={{ width: 20, height: 20, resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.lightGray,
                      fontWeight: 800,
                    }}>
                    VietcomBank
                  </Text>
                </View>
              );
            },
          },
          {
            value: BANKENUM.BIDV,
            label: '',
            icon() {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}>
                  <Image
                    source={require(`${bankLogoPath}BIDV.webp`)}
                    style={{ width: 20, height: 20, resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.lightGray,
                      fontWeight: 800,
                    }}>
                    BIDV
                  </Text>
                </View>
              );
            },
          },
          {
            value: BANKENUM.VPBANK,
            label: '',
            icon() {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}>
                  <Image
                    source={require(`${bankLogoPath}VPBank.webp`)}
                    style={{ width: 20, height: 20, resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.lightGray,
                      fontWeight: 800,
                    }}>
                    VPBank
                  </Text>
                </View>
              );
            },
          },
        ]}
      />
      <View
        style={{
          marginVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 4 }}>
          <Text style={{ fontSize: 12, color: colors.lightGray }}>Last update time:</Text>
          <Text style={{ fontSize: 12, color: colors.gray }}>{lastUpdateTime}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 4 }}>
          <Text style={{ fontSize: 12, color: colors.lightGray }}>Unit:</Text>
          <Text style={{ fontSize: 12, color: colors.gray }}>VND</Text>
        </View>
      </View>
      <View style={[styles.superContainer]}>
        <View style={[styles.superItemContainer]}>
          <Dropdown
            style={styles.dropdownField}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={exchangeRateFrom}
            maxHeight={300}
            labelField="rate"
            valueField="id"
            placeholder="Select currency"
            value={selectedExchangeRateFrom}
            renderItem={renderItem}
            onChange={item => {
              setSelectedExchangeRateFrom(item.id);
            }}
          />
          <TextInput
            style={styles.inputField}
            value={exchangeNumber.toString()}
            placeholder="Enter number to exchange"
            keyboardType="numeric"
            onChangeText={event => {
              if (event == 'Na' || event == '') setExchangeNumber(0);
              else setExchangeNumber(parseInt(event));
            }}
            onSubmitEditing={event => {
              submitExchangeCurrency(parseInt(event.nativeEvent.text));
            }}
          />
        </View>
        <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
          <Entypo name="arrow-bold-right" size={20} color={colors.lightGray} />
        </View>
        <View style={[styles.superItemContainer]}>
          <Dropdown
            style={styles.dropdownField}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={exchangeRateTo}
            maxHeight={300}
            labelField="rate"
            valueField="id"
            placeholder="Select currency"
            value={selectedExchangeRateTo}
            renderItem={renderItem}
            onChange={item => {
              setSelectedExchangeRateTo(item.id);
            }}
          />
          <View style={[styles.inputField, { justifyContent: 'center' }]}>
            <Text
              style={{
                color: colors.white,
              }}>
              {exchangedNumber}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Exchange;
