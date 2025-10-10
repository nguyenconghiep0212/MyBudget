import { fetchGoldPrice, getGoldPriceByMonth, GOLD_BRAND } from '@/services';
import { colors } from '@/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import { Gold } from '@/types/budget';
import { GetCategoryName, goldData } from '@/local_data/assets';
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
  superContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
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
const MetalTable = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [goldPrice, setGoldPrice] = useState({});
  const { refreshGoldPrice } = usePreciousMetalSlice();

  function MapTableData() {
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
    GetGoldPrice(GOLD_BRAND.SJC);
    MapTableData();
  }, [refreshGoldPrice]);
  useEffect(() => {
    MapTableData();
  }, [goldPrice]);

  return (
    <View>
      <View
        style={{
          borderColor: colors.darkGray,
          borderWidth: 0.5,
          paddingVertical: 4,
          paddingHorizontal: 8,
          width: 'auto',
          justifyContent: 'center',
          alignContent: 'center',
          borderRadius: 16,
        }}>
        <Text style={{ color: colors.lightGray }}>Add gold</Text>
      </View>
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
          <DataTable.Title
            numeric
            style={{ maxWidth: 90, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Text style={[styles.TableTitle]}>Current price</Text>
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
              <Text style={{ color: colors.lightGray, fontSize: 8 }}>
                {GetCategoryName(item.category)}
              </Text>
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
    </View>
  );
};

export default MetalTable;
