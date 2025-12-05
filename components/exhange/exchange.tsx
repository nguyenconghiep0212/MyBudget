import {
  fetchVPBankExchangeRate,
  fetchBIDVBankExchangeRate,
  fetchVietcomBankExchangeRate,
} from '@/services/exchange.service';
import { colors } from '@/theme';
import { useEffect, useState } from 'react';
import {
  Switch,
  StyleProp,
  View,
  ViewStyle,
  TextInput,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import { useExchangeSlice } from '@/slices/exchange.slice';
import { Dropdown } from 'react-native-element-dropdown';
import { Entypo } from '@expo/vector-icons';
import { formatCurrency, showAlert } from '@/utils/helper';
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
const bankLogoPath = '@/assets/images/banks/';
const flags: any = {
  vp: require(`${bankLogoPath}VPBank.webp`),
  bidv: require(`${bankLogoPath}BIDV.webp`),
  vietcom: require(`${bankLogoPath}VietcomBank.webp`),
};
const Exchange = ({ style }: ExchangeProps) => {
  const {
    dispatch,
    DataApiLoading,
    DataApiLoaded,
    refreshExchangeRate,
    SetVPBankExchangeRate,
    SetBIDVBankExchangeRate,
    SetVietcomBankExchangeRate,
    SetExchangeRateItems,
  } = useExchangeSlice();
  const [isSwitchOn, setIsSwitchOn] = useState('buy');
  const [exchangeNumber, setExchangeNumber] = useState<number>(0);
  const [exchangedNumber, setExchangedNumber] = useState<number>(0);
  const [exchangeRateFrom, setExchangeRateFrom] = useState<number[]>([]);
  const [exchangeRateTo, setExchangeRateTo] = useState<number[]>([]);
  const [selectedExchangeRateFrom, setSelectedExchangeRateFrom] = useState<number>(1);
  const [selectedExchangeRateTo, setSelectedExchangeRateTo] = useState<number>(1);

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

  function submitExchangeCurrency(number: number) {
    setExchangedNumber(number);
  }
  function onToggleSwitch() {
    if (isSwitchOn === 'buy') setIsSwitchOn('sell');
    else setIsSwitchOn('buy');
  }
  useEffect(() => {
    console.log('Fetching exchange rate data...');
    dispatch(DataApiLoading());
    Promise.all([getVPBankExchange(), getBIDVBankExchange(), getVietcomBankExchange()])
      .then(() => {
        dispatch(DataApiLoaded());
        dispatch(SetExchangeRateItems());
        console.log('Fetching exchange rate data succeeded.');
      })
      .catch(error => {
        showAlert('Network Error', 'Please check your Wifi/4G connection and try again.');
        dispatch(DataApiLoaded());
      });
  }, [refreshExchangeRate]);
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
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{ color: isSwitchOn === 'sell' ? colors.Negative : colors.gray, fontWeight: 600 }}>
          Sell price
        </Text>
        <Switch
          value={isSwitchOn === 'sell' ? false : true}
          trackColor={{ true: `${colors.Positive}60`, false: `${colors.Negative}60` }}
          thumbColor={isSwitchOn === 'buy' ? colors.Positive : colors.Negative}
          onValueChange={onToggleSwitch}
        />
        <Text
          style={{ color: isSwitchOn === 'buy' ? colors.Positive : colors.gray, fontWeight: 600 }}>
          Buy price
        </Text>
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
          <View style={{ columnGap: 2, marginTop: 2 }}>
            <View
              style={[
                {
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 4,
                },
              ]}>
              <Image
                source={flags['vp']}
                style={{ width: 15, height: 15, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  color: colors.lightGray,
                  fontSize: 13,
                  letterSpacing: 0.5,
                }}>
                {formatCurrency(exchangedNumber)}
              </Text>
            </View>
            <View
              style={[
                {
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 4,
                },
              ]}>
              <Image
                source={flags['bidv']}
                style={{ width: 15, height: 15, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  color: colors.lightGray,
                  fontSize: 13,
                  letterSpacing: 0.5,
                }}>
                {formatCurrency(exchangedNumber)}
              </Text>
            </View>
            <View
              style={[
                {
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 4,
                },
              ]}>
              <Image
                source={flags['vietcom']}
                style={{ width: 15, height: 15, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  color: colors.lightGray,
                  fontSize: 13,
                  letterSpacing: 0.5,
                }}>
                {formatCurrency(exchangedNumber)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Exchange;
