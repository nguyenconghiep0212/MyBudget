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
import { BANKENUM } from '@/types';
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
    fontSize: 10,
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
  vpbank: require(`${bankLogoPath}VPBank.webp`),
  bidv: require(`${bankLogoPath}BIDV.webp`),
  vietcombank: require(`${bankLogoPath}VietcomBank.webp`),
};
const countriesLogoPath = '@/assets/images/countries/';
const countriesFlags: any = {
  aud: require(`${countriesLogoPath}aud.webp`),
  cad: require(`${countriesLogoPath}cad.webp`),
  chf: require(`${countriesLogoPath}chf.webp`),
  cny: require(`${countriesLogoPath}cny.webp`),
  dkk: require(`${countriesLogoPath}dkk.webp`),
  eur: require(`${countriesLogoPath}eur.webp`),
  gbp: require(`${countriesLogoPath}gbp.webp`),
  hkd: require(`${countriesLogoPath}hkd.webp`),
  inr: require(`${countriesLogoPath}inr.webp`),
  jpy: require(`${countriesLogoPath}jpy.webp`),
  krw: require(`${countriesLogoPath}krw.webp`),
  kwd: require(`${countriesLogoPath}kwd.webp`),
  lak: require(`${countriesLogoPath}lak.webp`),
  myr: require(`${countriesLogoPath}myr.webp`),
  nok: require(`${countriesLogoPath}nok.webp`),
  nzd: require(`${countriesLogoPath}nzd.webp`),
  rub: require(`${countriesLogoPath}rub.webp`),
  sar: require(`${countriesLogoPath}sar.webp`),
  sek: require(`${countriesLogoPath}sek.webp`),
  sgd: require(`${countriesLogoPath}sgd.webp`),
  thb: require(`${countriesLogoPath}thb.webp`),
  twd: require(`${countriesLogoPath}twd.webp`),
  usd: require(`${countriesLogoPath}usd.webp`),
  vnd: require(`${countriesLogoPath}vnd.webp`),
};
const Exchange = ({ style }: ExchangeProps) => {
  const {
    dispatch,
    DataApiLoading,
    DataApiLoaded,
    refreshExchangeRate,
    exchangeRateList,
    SetVPBankExchangeRate,
    SetBIDVBankExchangeRate,
    SetVietcomBankExchangeRate,
    SetExchangeRateItems,
  } = useExchangeSlice();
  const [isSwitchOn, setIsSwitchOn] = useState('buy');
  const [exchangeNumber, setExchangeNumber] = useState<number>(0);
  const [exchangedNumber, setExchangedNumber] = useState<
    { bank: BANKENUM; rate: number; final: number }[]
  >([
    {
      bank: BANKENUM.VPBANK,
      rate: 1,
      final: 0,
    },
    {
      bank: BANKENUM.BIDV,
      rate: 1,
      final: 0,
    },
    {
      bank: BANKENUM.VIETCOMBANK,
      rate: 1,
      final: 0,
    },
  ]);
  const [selectedExchangeRateFrom, setSelectedExchangeRateFrom] = useState<string>('USD');
  const [selectedExchangeRateTo, setSelectedExchangeRateTo] = useState<string>('VND');

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
    const exchangeRateFrom =
      exchangeRateList.find(
        item => item.currencyCode.toLowerCase() === selectedExchangeRateFrom.toLowerCase(),
      )?.rates || [];
    const exchangeRateTo =
      exchangeRateList.find(
        item => item.currencyCode.toLowerCase() === selectedExchangeRateTo.toLowerCase(),
      )?.rates || [];
    const temp = [
      {
        bank: BANKENUM.VPBANK,
        rate: GetRate(BANKENUM.VPBANK),
        final: number * GetRate(BANKENUM.VPBANK),
      },
      {
        bank: BANKENUM.BIDV,
        rate: GetRate(BANKENUM.BIDV),
        final: number * GetRate(BANKENUM.BIDV),
      },
      {
        bank: BANKENUM.VIETCOMBANK,
        rate: GetRate(BANKENUM.VIETCOMBANK),
        final: number * GetRate(BANKENUM.VIETCOMBANK),
      },
    ];

    console.log('temp:', temp);
    setExchangedNumber(temp);
    function GetRate(bank: BANKENUM) {
      const temp =
        isSwitchOn === 'buy'
          ? (exchangeRateFrom.find(i => i.bank === bank)?.buyRateTransfer ||
              exchangeRateFrom.find(i => i.bank === bank)?.buyRateCash ||
              0) /
            (exchangeRateTo.find(i => i.bank === bank)?.buyRateTransfer ||
              exchangeRateTo.find(i => i.bank === bank)?.buyRateCash ||
              0)
          : (exchangeRateFrom.find(i => i.bank === bank)?.sellRateTransfer ||
              exchangeRateFrom.find(i => i.bank === bank)?.sellRateCash ||
              0) /
            (exchangeRateTo.find(i => i.bank === bank)?.sellRateTransfer ||
              exchangeRateTo.find(i => i.bank === bank)?.sellRateCash ||
              0);
      return temp === Infinity ? 0 : temp;
    }
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
  useEffect(() => {
    submitExchangeCurrency(exchangeNumber);
  }, [isSwitchOn, selectedExchangeRateTo, selectedExchangeRateFrom]);
  const renderItem = (item: any) => {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: colors.blackGray,
        }}>
        <Image
          source={countriesFlags[item.currencyCode.toLowerCase()]}
          style={{ width: 20, height: 20, resizeMode: 'contain', borderRadius: 4 }}
        />
        <Text style={styles.selectedTextStyle}>{item.currencyCode}</Text>
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
            data={exchangeRateList}
            maxHeight={300}
            labelField="currencyCode"
            valueField="currencyCode"
            placeholder="Select currency"
            value={selectedExchangeRateFrom}
            renderLeftIcon={() => (
              <View style={{ marginRight: 8 }}>
                {selectedExchangeRateFrom && (
                  <Image
                    source={countriesFlags[selectedExchangeRateFrom.toLowerCase()]}
                    style={{ width: 18, height: 18, resizeMode: 'contain', borderRadius: 4 }}
                  />
                )}
              </View>
            )}
            renderItem={renderItem}
            onChange={item => {
              setSelectedExchangeRateFrom(item.currencyCode);
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
            data={exchangeRateList}
            maxHeight={300}
            labelField="currencyCode"
            valueField="currencyCode"
            placeholder="Select currency"
            value={selectedExchangeRateTo}
            renderLeftIcon={() => (
              <View style={{ marginRight: 8 }}>
                {selectedExchangeRateTo && (
                  <Image
                    source={countriesFlags[selectedExchangeRateTo.toLowerCase()]}
                    style={{ width: 18, height: 18, resizeMode: 'contain', borderRadius: 4 }}
                  />
                )}
              </View>
            )}
            renderItem={renderItem}
            onChange={item => {
              setSelectedExchangeRateTo(item.currencyCode);
            }}
          />
          <View style={{ marginTop: 2 }}>
            {exchangedNumber.map((item, index) => {
              return (
                <View
                  key={index}
                  style={[
                    {
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 4,
                      marginTop: 2,
                    },
                  ]}>
                  <Image
                    source={flags[item.bank]}
                    style={{ width: 15, height: 15, resizeMode: 'contain' }}
                  />
                  {item.final === 0 ? (
                    <Text
                      style={{
                        color: colors.gray,
                        fontSize: 12,
                        letterSpacing: 0.5,
                        fontWeight: 800,
                      }}>
                      No Data
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: colors.lightGray,
                        fontSize: 12,
                        letterSpacing: 0.5,
                        fontWeight: 600,
                      }}>
                      {formatCurrency(item.final)}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Exchange;
