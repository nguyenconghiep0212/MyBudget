import { useExchangeSlice } from '@/slices/exchange.slice';
import { colors } from '@/theme';
import { BANKENUM, ExchangeRateTable } from '@/types/exchange';
import { formatCurrency } from '@/utils/helper';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text, ScrollView, Image } from 'react-native';
import { DataTable, Surface } from 'react-native-paper';
import usdFlag from '@/assets/images/countries/usd.webp';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: '100%',
  },
  priceText: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.75,
  },
  surface: {
    backgroundColor: colors.darkerGray,
    width: '100%',
    height: '100%',
    borderRadius: 6,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  TableTitle: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: 800,
  },
});
type ExchangeRateTableProps = {
  style?: StyleProp<ViewStyle>;
};
const flags = {
  usd: usdFlag,
};
const ExchangeRateTableView = ({ style }: ExchangeRateTableProps) => {
  const [exchangeTableData, setExchangeTableData] = useState<ExchangeRateTable[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const {
    dispatch,
    selectedBank,
    VPBankExchangeRate,
    BIDVBankExchangeRate,
    VietcomBankExchangeRate,
    SetLastUpdateTime,
  } = useExchangeSlice();
  const countriesLogoPath = '@/assets/images/countries/';
  function standardizeBankDataObject(bank: BANKENUM) {
    let exchangeRateTable: ExchangeRateTable[] = [];
    switch (bank) {
      case BANKENUM.VIETCOMBANK:
        try {
          dispatch(SetLastUpdateTime(formatTime(new Date(VietcomBankExchangeRate.UpdatedDate))));
          VietcomBankExchangeRate.Data.forEach(item => {
            exchangeRateTable.push({
              flag: flags[item.currencyCode.toLowerCase()],
              currencyName: item.currencyName,
              currencyCode: item.currencyCode,
              buyRateCash: parseFloat(item.cash.split(',').join('')),
              buyRateTransfer: parseFloat(item.transfer.split(',').join('')),
              sellRateCash: parseFloat(item.sell.split(',').join('')),
              sellRateTransfer: parseFloat(item.sell.split(',').join('')),
            });
          });
          exchangeRateTable.sort((a, b) => (a.currencyCode < b.currencyCode ? 1 : -1));
          setExchangeTableData(exchangeRateTable);
        } catch (e) {
          console.error(e);
        } finally {
          setRefreshFlag(!refreshFlag);
          return null;
        }
      case BANKENUM.BIDV:
        try {
          dispatch(
            SetLastUpdateTime(`${BIDVBankExchangeRate.hour} - ${BIDVBankExchangeRate.day_vi}`),
          );
          BIDVBankExchangeRate.data.forEach(item => {
            if (item.currency !== 'USD(10-20)' && item.currency !== 'USD(1-2-5)')
              exchangeRateTable.push({
                flag: countriesLogoPath + 'im_flag_' + item.currency.toLowerCase() + '.webp',
                currencyName: item.nameVI,
                currencyCode: item.currency,
                buyRateCash: parseFloat(item.muaTm.split(',').join('')),
                buyRateTransfer: parseFloat(item.muaCk.split(',').join('')),
                sellRateCash: parseFloat(item.ban.split(',').join('')),
                sellRateTransfer: parseFloat(item.ban.split(',').join('')),
              });
          });
          exchangeRateTable.sort((a, b) => (a.currencyCode < b.currencyCode ? 1 : -1));
          setExchangeTableData(exchangeRateTable);
        } catch (e) {
          console.error(e);
        } finally {
          setRefreshFlag(!refreshFlag);
          return null;
        }
      case BANKENUM.VPBANK:
        try {
          dispatch(SetLastUpdateTime(formatTime(new Date(VPBankExchangeRate.effectiveTime))));
          VPBankExchangeRate.exchangeRates.forEach(item => {
            if (item.currency !== 'XAU')
              exchangeRateTable.push({
                flag: countriesLogoPath + 'im_flag_' + item.currency.toLowerCase() + '.webp',
                currencyName: item.currencyName,
                currencyCode: item.currency,
                buyRateCash: item.buyCash,
                buyRateTransfer: item.buyTransfer,
                sellRateCash: item.sellCash,
                sellRateTransfer: item.sellTransfer,
              });
          });
          exchangeRateTable.sort((a, b) => (a.currencyCode < b.currencyCode ? 1 : -1));
          setExchangeTableData(exchangeRateTable);
        } catch (e) {
          console.error(e);
        } finally {
          setRefreshFlag(!refreshFlag);
          return null;
        }
      default:
        return null;
    }
  }
  function formatTime(date: Date): string {
    return `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} - ${date.getDate() < 10 ? '0' : ''}${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  useFocusEffect(
    useCallback(() => {
      standardizeBankDataObject(selectedBank);
    }, [selectedBank]),
  );
  useEffect(() => {}, [refreshFlag]);
  return (
    <ScrollView style={{ height: '100%', width: '100%' }}>
      <View style={{ height: '100%', width: '100%' }}>
        <View style={[style, styles.body]}>
          <Surface
            style={{
              ...styles.surface,
            }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>
                  <Text style={styles.TableTitle}>Currency</Text>
                </DataTable.Title>
                <DataTable.Title style={{ justifyContent: 'center' }}>
                  <Text style={styles.TableTitle}>Name</Text>
                </DataTable.Title>
                <DataTable.Title style={{ justifyContent: 'center' }}>
                  <Text style={styles.TableTitle}>Buy</Text>
                </DataTable.Title>
                <DataTable.Title style={{ justifyContent: 'center' }}>
                  <Text style={styles.TableTitle}>Sell</Text>
                </DataTable.Title>
              </DataTable.Header>

              {exchangeTableData.map((item, index) => (
                <DataTable.Row
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? colors.black : colors.blackGray,
                  }}>
                  <DataTable.Cell>
                    <View>
                      <Image
                        source={{
                          uri:
                            countriesLogoPath +
                            'im_flag_' +
                            item.currencyCode.toLowerCase() +
                            '.webp',
                        }}
                        style={{ width: 20, height: 14, resizeMode: 'contain', marginBottom: 2 }}
                      />
                      <Text style={{ color: colors.lightGray, fontSize: 12 }}>
                        {item.currencyCode}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={{ color: colors.lightGray, fontSize: 10 }}>
                      {item.currencyName}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={{ justifyContent: 'center' }}>
                    <Text style={{ ...styles.priceText, color: colors.Positive }}>
                      {formatCurrency(item.buyRateTransfer || item.buyRateCash)}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={{ justifyContent: 'center' }}>
                    <Text style={{ ...styles.priceText, color: colors.Negative }}>
                      {formatCurrency(item.sellRateTransfer || item.sellRateCash)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Surface>
        </View>
      </View>
    </ScrollView>
  );
};

export default ExchangeRateTableView;
