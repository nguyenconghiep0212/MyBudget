import { useExchangeSlice } from '@/slices/exchange.slice';
import { colors } from '@/theme';
import { BANKENUM, ExchangeRateTable } from '@/types/exchange';
import { formatCurrency } from '@/utils/helper';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text, ScrollView, Image } from 'react-native';
import { DataTable, Surface } from 'react-native-paper';
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

const ExchangeRateTableView = ({ style }: ExchangeRateTableProps) => {
  const [exchangeTableData, setExchangeTableData] = useState<ExchangeRateTable[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const {
    dispatch,
    loadingDataApi,
    selectedBank,
    VPBankExchangeRate,
    BIDVBankExchangeRate,
    VietcomBankExchangeRate,
    SetLastUpdateTime,
  } = useExchangeSlice();
  const countriesLogoPath = '@/assets/images/countries/';
  const flags: any = {
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
  };
  function standardizeBankDataObject(bank: BANKENUM) {
    let exchangeRateTable: ExchangeRateTable[] = [];
    switch (bank) {
      case BANKENUM.VIETCOMBANK:
        try {
          dispatch(SetLastUpdateTime(formatTime(new Date(VietcomBankExchangeRate.UpdatedDate))));
          VietcomBankExchangeRate.Data.forEach(item => {
            exchangeRateTable.push({
              flag: flags[item.currencyCode.toLowerCase()] || null,
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
                flag: flags[item.currency.toLowerCase()] || null,
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
                flag: flags[item.currency.toLowerCase()] || null,
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
    }, [selectedBank, loadingDataApi]),
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
                <DataTable.Title style={{ maxWidth: 40, justifyContent: 'flex-start' }}>
                  <Text style={styles.TableTitle}>Code</Text>
                </DataTable.Title>
                <DataTable.Title style={{ justifyContent: 'center' }}>
                  <Text style={styles.TableTitle}>Currency</Text>
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
                  <DataTable.Cell style={{ maxWidth: 40, justifyContent: 'flex-start' }}>
                    <View>
                      {item.currencyCode && (
                        <Image
                          source={item.flag}
                          style={{
                            width: 20,
                            height: 14,
                            resizeMode: 'contain',
                            marginBottom: 2,
                            borderRadius: 4,
                          }}
                        />
                      )}
                      <Text style={{ color: colors.lightGray, fontSize: 10, fontWeight: 800 }}>
                        {item.currencyCode}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell style={{ justifyContent: 'center' }}>
                    <Text style={{ color: colors.lightGray, fontSize: 10, textAlign: 'center' }}>
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
