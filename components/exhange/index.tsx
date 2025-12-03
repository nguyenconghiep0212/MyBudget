import {
  fetchVPBankExchangeRate,
  fetchBIDVBankExchangeRate,
  fetchVietcomBankExchangeRate,
} from '@/services/exchange.service';
import { colors } from '@/theme';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleProp, View, Image, ViewStyle, TextInput, StyleSheet, Text } from 'react-native';
import { BIDVBank, VPBank, VietcomBank } from '@/types/exchange';
import { SegmentedButtons } from 'react-native-paper';
const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: colors.blackGray,
    color: colors.white,
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
});
type ExchangeProps = {
  style?: StyleProp<ViewStyle>;
};
type Banks = 'vietcombank' | 'bidv' | 'vpbank';
const Exchange = ({ style }: ExchangeProps) => {
  const [exchangeNumber, setExchangeNuber] = useState<number>(1);
  const [selectedBank, setSelectedBank] = useState<string>('vietcombank');
  const [VPBankExchangeRate, setVPBankExchangeRate] = useState<VPBank>({
    effectiveTime: '',
    exchangeRates: [],
  });
  const [BIDVBankExchangeRate, setBIDVBankExchangeRate] = useState<BIDVBank>({
    hour: '',
    day_vi: '',
    data: [],
    note_vi: '',
    note_en: '',
  });
  const [VietcomBankExchangeRate, setVietcomBankExchangeRate] = useState<VietcomBank>({
    UpdatedDate: '',
    Data: [],
  });
  async function getVPBankExchange() {
    const res = await fetchVPBankExchangeRate();
    if (res) {
      setVPBankExchangeRate(res);
      standardizeBankDataObject('vpbank');
    }
  }
  async function getBIDVBankExchange() {
    const res = await fetchBIDVBankExchangeRate();
    if (res) {
      setBIDVBankExchangeRate(res);
      standardizeBankDataObject('bidv');
    }
  }
  async function getVietcomBankExchange() {
    const res = await fetchVietcomBankExchangeRate();
    if (res) {
      setVietcomBankExchangeRate(res);
      standardizeBankDataObject('vietcombank');
    }
  }

  function standardizeBankDataObject(bank: Banks) {
    switch (bank) {
      case 'vietcombank':
        return VietcomBankExchangeRate;
      case 'bidv':
        return BIDVBankExchangeRate;
      case 'vpbank':
        return VPBankExchangeRate;
      default:
        return null;
    }
  }
  useFocusEffect(
    useCallback(() => {
      getVPBankExchange();
      getBIDVBankExchange();
      getVietcomBankExchange();
    }, []),
  );
  return (
    <View style={[style, { width: '100%' }]}>
      <Text style={{ color: colors.gray, marginVertical: 8, fontSize: 12 }}>
        * Bank exchange rates are for reference only and may vary *
      </Text>
      <SegmentedButtons
        value={selectedBank}
        onValueChange={setSelectedBank}
        buttons={[
          {
            value: 'vietcombank',
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
                    source={require('@/assets/images/VietcomBank.webp')}
                    style={{ width: 20, height: 20, resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: selectedBank != 'vietcombank' ? colors.lightGray : colors.blackGray,
                      fontWeight: 800,
                    }}>
                    VietcomBank
                  </Text>
                </View>
              );
            },
          },
          {
            value: 'bidv',
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
                    source={require('@/assets/images/BIDV.webp')}
                    style={{ width: 20, height: 20, resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: selectedBank != 'bidv' ? colors.lightGray : colors.blackGray,
                      fontWeight: 800,
                    }}>
                    BIDV
                  </Text>
                </View>
              );
            },
          },
          {
            value: 'vpbank',
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
                    source={require('@/assets/images/VPBank.webp')}
                    style={{ width: 20, height: 20, resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: selectedBank != 'vpbank' ? colors.lightGray : colors.blackGray,
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
      <TextInput
        style={styles.input}
        onChangeText={() => {}}
        value={exchangeNumber.toString()}
        placeholder="Enter number to exchange"
        keyboardType="numeric"
      />
    </View>
  );
};

export default Exchange;
