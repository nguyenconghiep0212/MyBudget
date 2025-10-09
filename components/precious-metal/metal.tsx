import { fetchGoldPrice, getAllFiles, GOLD_BRAND, refreshApiKey, RemoveFile } from '@/services';
import { colors } from '@/theme';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import { Gold } from '@/types/budget';
import { goldData } from '@/local_data/assets';
import { usePreciousMetalSlice } from '@/slices';
import { formatCurrency } from '@/utils/helper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
  text: {
    color: colors.white,
  },
  TableTitle: {
    color: colors.lightGray,
    fontSize: 10,
  },
});
interface TableData {
  own: number;
  category: string;
  priceAtBought: number;
  priceCurrent: number;
  discrepancy: number;
}
const Metal = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [goldPrice, setGoldPrice] = useState({});
  const { refreshGoldPrice, RefreshGoldPrice } = usePreciousMetalSlice();

  function MapTableData() {
    console.log('goldPrice: ' + JSON.stringify(goldPrice));
    const result: TableData[] = [];
    goldData.forEach((item: Gold) => {
      const temp = Object.entries(goldPrice).find(
        ([key, value]) => key === `sell_${item.category}`,
      );
      const priceCurrent = temp ? parseInt(temp[1] + '') : 0;
      const discrepancy = priceCurrent - item.priceAtBought;
      result.push({
        ...item,
        priceCurrent,
        discrepancy,
      });
    });
    setTableData(result);
  }
  async function GetGoldPrice(brand: GOLD_BRAND) {
    const res = await fetchGoldPrice(brand);
    if (res) {
      setGoldPrice(res[0]);
    }
  }
  useEffect(() => {
    MapTableData();
    GetGoldPrice(GOLD_BRAND.SJC);
  }, []);
  useEffect(() => {
    MapTableData();
    GetGoldPrice(GOLD_BRAND.SJC);
  }, [refreshGoldPrice]);
  function GoldDataTable() {
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ maxWidth: 30, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Own</Text>
          </DataTable.Title>
          <DataTable.Title style={{ maxWidth: 92, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Categories</Text>
          </DataTable.Title>
          <DataTable.Title numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Bought</Text>
          </DataTable.Title>
          <DataTable.Title numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Current</Text>
          </DataTable.Title>
          <DataTable.Title numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Discrepancy</Text>
          </DataTable.Title>
        </DataTable.Header>
        {tableData.map((item: any, index: number) => (
          <DataTable.Row
            key={index}
            style={{
              backgroundColor: index % 2 === 0 ? colors.black : colors.blackGray,
            }}>
            <DataTable.Cell style={{ maxWidth: 30, justifyContent: 'center' }}>
              <Text style={{ color: colors.lightGray, fontSize: 12 }}>{item.own}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ maxWidth: 92, justifyContent: 'center' }}>
              <Text style={{ color: colors.lightGray, fontSize: 12 }}>{item.category}</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
              <Text
                style={{
                  fontWeight: 200,
                  fontSize: 9,
                  letterSpacing: 0.75,
                  color: colors.NavyBlueText,
                }}>
                {formatCurrency(item.priceAtBought)}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
              <Text
                style={{
                  fontWeight: 200,
                  fontSize: 9,
                  letterSpacing: 0.75,
                  color: item.discrepancy > 0 ? colors.Positive : colors.Negative,
                }}>
                {formatCurrency(item.priceCurrent)}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
              <Text
                style={{
                  fontWeight: 200,
                  fontSize: 9,
                  letterSpacing: 0.75,
                  color: item.discrepancy > 0 ? colors.Positive : colors.Negative,
                }}>
                {formatCurrency(item.discrepancy)}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    );
  }
  return (
    <View style={[styles.body, { marginTop: 12 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AntDesign name="gold" size={24} color={colors.gold} />
        <Text
          style={{
            color: colors.gray,
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: 1.5,
          }}>
          GOLD
        </Text>
        <View
          style={{
            flexGrow: 1,
            marginRight: 4,
            height: 1.5,
            backgroundColor: colors.gray,
          }}></View>
      </View>
      <View style={{ width: '100%' }}>
        <GoldDataTable />
      </View>
    </View>
  );
};

export default Metal;
