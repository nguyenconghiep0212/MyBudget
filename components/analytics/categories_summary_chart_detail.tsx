import { expenseCategory, GetCategoryById } from '@/local_data/data';
import { colors } from '@/theme';
import { Category } from '@/types/budget';
import { formatCurrency } from '@/utils/helper';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Dialog, Portal } from 'react-native-paper';
const styles = StyleSheet.create({
  portal: {
    fontSize: 28,
    fontWeight: 500,
    minHeight: 450,
    backgroundColor: colors.blackGray,
  },
  portalBody: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
type AnalyticProps = {
  style?: StyleProp<ViewStyle>;
  chartData: any;
  modalVisible: boolean;
  date: string;
  onClose: () => void;
};

const CategoryChartDetail = ({ date, chartData, modalVisible, style, onClose }: AnalyticProps) => {
  const [chartDataDisplay, setChartDataDisplay] = useState<any[]>([]);
  const [chartOptions, setChartOptions] = useState<any>({});
  const offset = 10_000;
  function MapChartData() {
    const temp: any = [];
    expenseCategory.forEach((item: Category) => {
      const temp2 = chartData.find((cd: any) => parseInt(cd.categoryId) === item.id);
      temp.push({
        value: temp2 ? temp2.value / offset : 0,
        frontColor: temp2 ? temp2.color : colors.white,
        label: GetCategoryById(item.id)?.name || 'N/A',
        labelTextStyle: { color: colors.gray },
        // labelWidth: 60,
        labelComponent: () => customLabel(GetCategoryById(item.id)?.name || 'N/A'),
        topLabelComponent: () => (
          <Text style={{ color: colors.lightGray, fontSize: 6 }}>
            {temp2 ? (temp2.value / offset).toFixed(0) : 0}
          </Text>
        ),
      });
    });
    const maxExpense = Math.max(...temp.map((o: any) => o.value));
    const noOfSections = 5;
    console.log('maxExpense', Math.ceil(maxExpense / noOfSections));
    const chartOption = {
      noOfSections,
      stepValue: Math.ceil(maxExpense / noOfSections),
    };
    setChartOptions(chartOption);
    setChartDataDisplay(temp);
  }
  const customLabel = (val: string) => {
    return (
      <View style={{ marginLeft: -38, width: 60, alignItems: 'flex-end' }}>
        <Text
          style={{
            color: colors.lightGray,
            fontWeight: 600,
            fontSize: 11,
          }}>
          {val}
        </Text>
      </View>
    );
  };
  useEffect(() => {
    MapChartData();
  }, [chartData]);

  return (
    <View style={[style]}>
      <Portal>
        <Dialog visible={modalVisible} style={styles.portal} onDismiss={onClose}>
          <Dialog.Content style={styles.portalBody}>
            <Text
              style={[
                {
                  fontSize: 24,
                  color: colors.gray,
                  fontWeight: 700,
                  letterSpacing: 1,
                },
              ]}>
              {date}
            </Text>
            <Text
              style={{
                color: colors.gray,
                fontSize: 10,
                letterSpacing: 0.75,
                alignSelf: 'flex-end',
              }}>
              Unit: {formatCurrency(offset)} vnd
            </Text>
            <View style={{ marginTop: -12, marginLeft: -12, width: '100%' }}>
              <BarChart
                horizontal
                barBorderRadius={0}
                data={chartDataDisplay}
                barWidth={16}
                spacing={10}
                rulesColor={colors.darkGray}
                xAxisThickness={1}
                yAxisThickness={0}
                yAxisTextStyle={{ fontSize: 10, color: colors.gray }}
                noOfSections={chartOptions.noOfSections}
                stepValue={chartOptions.stepValue}
              />
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

export default CategoryChartDetail;
