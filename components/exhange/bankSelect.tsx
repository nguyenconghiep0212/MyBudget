import { useExchangeSlice } from '@/slices/exchange.slice';
import { colors } from '@/theme';
import { BANKENUM } from '@/types';
import { useState } from 'react';
import { View, Image, Text, StyleProp, ViewStyle } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
type BankSelectProps = {
  style?: StyleProp<ViewStyle>;
};
const bankLogoPath = '@/assets/images/banks/';
const flags: any = {
  vp: require(`${bankLogoPath}VPBank.webp`),
  bidv: require(`${bankLogoPath}BIDV.webp`),
  vietcom: require(`${bankLogoPath}VietcomBank.webp`),
};
const BankSelect = ({ style }: BankSelectProps) => {
  const { dispatch, lastUpdateTime, SetSelectedBank } = useExchangeSlice();
  const [selectedBank, setSelectedBank] = useState<string>(BANKENUM.VIETCOMBANK);
  const bankLogoPath = '@/assets/images/banks/';

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
  return (
    <View style={[style, { width: '100%' }]}>
      <Text style={{ color: colors.darkGray, marginBottom: 4, fontSize: 12 }}>
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
                    source={flags['vietcom']}
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
                    source={flags['bidv']}
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
                    source={flags['vp']}
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
          marginTop: 8,
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
    </View>
  );
};

export default BankSelect;
