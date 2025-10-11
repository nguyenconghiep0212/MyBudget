import { fetchGoldPrice, getGoldPriceByMonth, GOLD_BRAND, refreshApiKey } from '@/services';
import { colors } from '@/theme';
import { LineChart } from 'react-native-gifted-charts';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Surface } from 'react-native-paper';
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
const MetalChart = () => {
  const { refreshGoldPrice } = usePreciousMetalSlice();
  const [chartData, setChartData] = useState<any>({ sellPrice: [], buyPrice: [] });
  const [chartOptions, setChartOption] = useState<any>({});
  const offset = 10_000_000;
  async function MapGoldPriceChart() {
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

  useEffect(() => {
    MapGoldPriceChart();
  }, [refreshGoldPrice]);

  useEffect(() => {}, [chartData, chartOptions]);

  return (
    <Surface
      style={{
        backgroundColor: colors.darkerGray,
        borderRadius: 6,
        marginTop: 10,
        paddingTop: 6,
        paddingBottom: 10,
      }}>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
        <Text
          style={{
            marginLeft: 12,
            paddingTop: 1,
            color: colors.gray,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 0.75,
          }}>
          SJC 99.99
        </Text>
        <Text
          style={{
            color: colors.lightGray,
            fontSize: 14,
            letterSpacing: 1,
          }}>
          in the last 30 days
        </Text>
      </View>
      <View style={[styles.superContainer, { marginBottom: 6 }]}>
        <View
          style={[
            styles.superItemContainer,
            { flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 12 },
          ]}>
          <View
            style={{
              width: 18,
              borderRadius: 2,
              height: 8,
              backgroundColor: colors.Positive,
            }}></View>
          <Text style={{ color: colors.lightGray, fontSize: 12, letterSpacing: 0.75 }}>Buy</Text>
          <View
            style={{
              width: 18,
              borderRadius: 2,
              height: 8,
              backgroundColor: colors.Negative,
              marginLeft: 16,
            }}></View>
          <Text style={{ color: colors.lightGray, fontSize: 12, letterSpacing: 0.75 }}>Sell</Text>
        </View>
        <View style={[styles.superItemContainer, { alignItems: 'flex-end', paddingRight: 16 }]}>
          <Text style={{ color: colors.gray, fontSize: 12, letterSpacing: 0.75 }}>
            Unit: 10 million
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            paddingRight: 16,
            alignItems: 'flex-end',
            width: '100%',
          }}>
          <Text style={{ color: colors.lightGray, fontSize: 12, letterSpacing: 0.75 }}>
            Sell:
            <Text style={{ color: colors.Negative }}>
              {' '}
              {formatCurrency(chartData.sellPrice[chartData.buyPrice.length - 1].value * offset)}
            </Text>
          </Text>
          <Text style={{ color: colors.lightGray, fontSize: 12, letterSpacing: 0.75 }}>
            Buy:
            <Text style={{ color: colors.Positive }}>
              {' ' +
                formatCurrency(chartData.buyPrice[chartData.buyPrice.length - 1].value * offset)}
            </Text>
          </Text>
        </View>
      </View>
      <LineChart
        areaChart
        extrapolateMissingValues={true}
        yAxisTextStyle={{ fontSize: 10, color: colors.gray }}
        data={chartData.buyPrice}
        data2={chartData.sellPrice}
        noOfSections={chartOptions.noOfSections}
        stepValue={chartOptions.stepValue}
        showFractionalValues
        height={180}
        showVerticalLines
        yAxisOffset={chartOptions.yAxisOffset}
        spacing={chartOptions.spacing}
        initialSpacing={0}
        color1={colors.Positive}
        color2={colors.Negative}
        textColor1={colors.lightGray}
        textColor2={colors.lightGray}
        hideDataPoints
        startFillColor1={colors.Positive}
        startFillColor2={colors.Negative}
        startOpacity={0.3}
        endOpacity={0.2}
        rulesColor={colors.darkGray}
        verticalLinesColor={colors.gray}
      />
    </Surface>
  );
};

export default MetalChart;
