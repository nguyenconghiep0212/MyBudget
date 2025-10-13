import { fetchGoldPricePNJ, fetchGoldPriceSJC, getGoldPriceByMonth } from '@/services';
import { colors } from '@/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { DataTable, Divider, Surface } from 'react-native-paper';
import { usePreciousMetalSlice } from '@/slices';
import { formatCurrency } from '@/utils/helper';
import { SJC, PNJ } from '@/types/gold';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
  superContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    paddingHorizontal: 24,
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  priceText: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.75,
  },
  surface: {
    backgroundColor: colors.darkerGray,
    borderRadius: 6,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  surfaceTitle: {
    color: colors.gray,
    fontSize: 18,
    marginLeft: 8,
    marginTop: 8,
    letterSpacing: 1,
    fontWeight: 800,
  },
  surfaceSubTitle: {
    color: colors.gray,
    marginLeft: 8,
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: 400,
  },
  TableTitle: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: 800,
  },
  tabTitle: {
    letterSpacing: 1,
    fontSize: 16,
    fontWeight: 700,
  },
});

const MetalTabs = () => {
  const [view, setView] = useState<'SJC' | 'PNJ'>('SJC');
  const { refreshGoldPrice } = usePreciousMetalSlice();
  const [goldPriceSJC, setGoldPriceSJC] = useState<{
    data: SJC[];
    latestDate: string;
    success: boolean;
  }>({ data: [], latestDate: '', success: true });
  const [goldPricePNJ, setGoldPricePNJ] = useState<{
    chinhanh: string;
    data: PNJ[];
    updateDate: string;
  }>({
    chinhanh: '',
    data: [],
    updateDate: '',
  });
  async function FetchGoldPriceSJC() {
    try {
      const res = await fetchGoldPriceSJC();
      if (res) {
        setGoldPriceSJC(res);
      }
    } catch (error) {}
  }
  async function FetchGoldPricePNJ() {
    try {
      const res = await fetchGoldPricePNJ();
      if (res) {
        setGoldPricePNJ(res);
      }
    } catch (error) {}
  }
  useEffect(() => {
    FetchGoldPriceSJC();
    FetchGoldPricePNJ();
  }, [refreshGoldPrice]);
  useEffect(() => {}, [goldPricePNJ, goldPriceSJC]);
  const SJCTable = () => {
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ justifyContent: 'flex-start' }}>
            <Text style={[styles.TableTitle]}>Gold Type</Text>
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Buy</Text>
          </DataTable.Title>
          <DataTable.Title numeric style={{ justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Sell</Text>
          </DataTable.Title>
        </DataTable.Header>
        {goldPriceSJC.data.map((item: any, index: number) => {
          if (item.BranchName === 'Hồ Chí Minh') {
            return (
              <DataTable.Row
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? colors.black : colors.blackGray,
                }}>
                <DataTable.Cell style={{ justifyContent: 'flex-start' }}>
                  <Text style={{ color: colors.lightGray, fontSize: 12 }}>{item.TypeName}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: colors.Positive,
                      ...styles.priceText,
                    }}>
                    {formatCurrency(parseInt(item.BuyValue))}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ justifyContent: 'center' }}>
                  <Text
                    style={{
                      ...styles.priceText,
                      color: colors.Negative,
                    }}>
                    {formatCurrency(parseInt(item.SellValue))}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          }
        })}
      </DataTable>
    );
  };
  const PNJView = () => {
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ justifyContent: 'flex-start' }}>
            <Text style={[styles.TableTitle]}>Gold Type</Text>
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Buy</Text>
          </DataTable.Title>
          <DataTable.Title numeric style={{ justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Sell</Text>
          </DataTable.Title>
        </DataTable.Header>
        {goldPricePNJ.data.map((item: any, index: number) => {
          return (
            <DataTable.Row
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? colors.black : colors.blackGray,
              }}>
              <DataTable.Cell style={{ justifyContent: 'flex-start' }}>
                <Text style={{ color: colors.lightGray, fontSize: 12 }}>{item.tensp}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text
                  style={{
                    ...styles.priceText,
                    color: colors.Positive,
                  }}>
                  {formatCurrency(parseInt(item.giamua) * 10_000)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ justifyContent: 'center' }}>
                <Text
                  style={{
                    ...styles.priceText,
                    color: colors.Negative,
                  }}>
                  {formatCurrency(parseInt(item.giaban) * 10_000)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          );
        })}
      </DataTable>
    );
  };
  return (
    <View style={{ gap: 12 }}>
      <View style={styles.superContainer}>
        <TouchableOpacity
          style={[
            styles.superItemContainer,
            {
              backgroundColor: colors.blackGray,
              borderBottomWidth: view === 'SJC' ? 2 : 0,
              borderColor: colors.gray,
            },
          ]}
          onPress={() => setView('SJC')}>
          <Text
            style={[
              styles.tabTitle,
              { color: view === 'SJC' ? colors.lightGray : colors.darkGray },
            ]}>
            SJC
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.superItemContainer,
            {
              backgroundColor: colors.blackGray,
              borderBottomWidth: view === 'PNJ' ? 2 : 0,
              borderColor: colors.gray,
            },
          ]}
          onPress={() => setView('PNJ')}>
          <Text
            style={[
              styles.tabTitle,
              { color: view === 'PNJ' ? colors.lightGray : colors.darkGray },
            ]}>
            PNJ
          </Text>
        </TouchableOpacity>
      </View>
      {view === 'SJC' ? (
        <Surface
          style={{
            ...styles.surface,
          }}>
          <View>
            <Text
              style={{
                ...styles.surfaceTitle,
              }}>
              SJC Price
            </Text>
            <Text
              style={{
                ...styles.surfaceSubTitle,
              }}>
              Last update:
              {' ' + goldPriceSJC.latestDate}
            </Text>
          </View>
          <SJCTable />
        </Surface>
      ) : (
        <Surface
          style={{
            ...styles.surface,
          }}>
          <View>
            <Text
              style={{
                ...styles.surfaceTitle,
              }}>
              PNJ Price
            </Text>
            <Text
              style={{
                ...styles.surfaceSubTitle,
              }}>
              Last update:
              {' ' + goldPricePNJ.updateDate}
            </Text>
          </View>
          <PNJView />
        </Surface>
      )}
    </View>
  );
};

export default MetalTabs;
