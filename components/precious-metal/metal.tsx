import { fetchGoldPrice, getGoldPriceByMonth, GOLD_BRAND, refreshApiKey } from '@/services';
import { colors } from '@/theme';
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import { Gold } from '@/types/budget';
import { goldData } from '@/local_data/assets';
import { usePreciousMetalSlice } from '@/slices';

import ChartMonthGoldPrice from './metal_chart';
import GoldDataTable from './metal_table';
import { Divider } from 'react-native-paper';
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
const Metal = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [goldPrice, setGoldPrice] = useState({});
  const { refreshGoldPrice, RefreshGoldPrice } = usePreciousMetalSlice();
  const [chartData, setChartData] = useState<any>({ sellPrice: [], buyPrice: [] });
  const [chartOptions, setChartOption] = useState<any>({});
  async function MapGoldPriceChart() {
    const offset = 10_000_000;
    const res = await getGoldPriceByMonth();
    if (res) {
      const temp: any = { sellPrice: [], buyPrice: [] };
      res.xAxis.categories.forEach((item: string, index: number) => {
        temp.buyPrice.push({
          value: res.series[0].data[index] / offset,
          labelComponent: index % 5 == 0 ? () => customLabel(item) : '',
        });
        temp.sellPrice.push({
          value: res.series[1].data[index] / offset,
          labelComponent: index % 5 == 0 ? () => customLabel(item) : '',
        });
      });
      setChartData(temp);
      // SET CHART OPTIONS
      const allValue = res.series[0].data.concat(res.series[1].data);
      const maxValue = Math.max(...allValue) / offset;
      const minValue = Math.min(...allValue) / offset;
      const stepValue = 0.5;
      const noOfSections = Math.ceil(maxValue - minValue) / stepValue;
      setChartOption({
        noOfSections,
        stepValue,
        yAxisOffset: Math.floor(minValue) + stepValue,
        spacing: 9.5,
      });
    }
    const customLabel = (val: string) => {
      return (
        <View style={{ marginLeft: 10, position: 'absolute', flexWrap: 'nowrap', width: 12 }}>
          <Text
            style={{
              color: colors.lightGray,
              fontWeight: 300,
              fontSize: 8,
            }}>
            {val}
          </Text>
        </View>
      );
    };
  }
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
    MapGoldPriceChart();
    GetGoldPrice(GOLD_BRAND.SJC);
    MapTableData();
  }, [refreshGoldPrice]);
  useEffect(() => {
    MapTableData();
  }, [goldPrice]);
  useEffect(() => {}, [chartData, chartOptions]);

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
        <ChartMonthGoldPrice />
        <GoldDataTable />
      </View>
    </View>
  );
};

export default Metal;
