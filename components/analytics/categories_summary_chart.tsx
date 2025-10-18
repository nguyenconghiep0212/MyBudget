import { budgetEvent, expenseCategory, GetCategoryById, monthlyBudget } from '@/local_data/data';
import { colors } from '@/theme';
import { BudgetEvent, MonthlyBudget } from '@/types/budget';
import { months } from '@/utils/helper';
import { useFocusEffect } from 'expo-router';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Divider, Surface } from 'react-native-paper';
import CategoryChartDetail from './categories_summary_chart_detail';
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
});
type AnalyticProps = {
  style?: StyleProp<ViewStyle>;
  selectedYear: number;
  title?: ReactNode;
};

const CategoryChart = ({ title, selectedYear, style }: AnalyticProps) => {
  const [chartData, setChartData] = useState<any[]>([{ value: 54, color: '#177AD5', text: '54%' }]);
  const [chartDataMonth, setChartDataMonth] = useState<any[]>([]);
  const [detailData, setDetailData] = useState<any[]>([]);
  const [detailDate, setDetailDate] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  function getMonthlyCategorySpending(events: BudgetEvent[], year: number) {
    const totals: { [month: number]: { [key: number]: number } } = {};
    events.forEach(event => {
      const year = event.date.getFullYear();
      const month = event.date.getMonth();
      if (year === selectedYear) {
        if (totals[month] === undefined) {
          totals[month] = {};
        }
        if (totals[month][event.categoryId] === undefined) {
          totals[month][event.categoryId] = 0;
        }
        totals[month][event.categoryId] = totals[month][event.categoryId] + event.amount;
      }
    });
    const temp = sortObjectKeys(totals);

    const temp2: any = [];
    for (let index = 0; index < 12; index++) {
      temp2[index] = [];
      if (totals[index]) {
        const totalSpending = Object.values(totals[index]).reduce((sum, val) => sum + val, 0);
        Object.entries(totals[index]).map(([categoryId, total]) => {
          temp2[index].push({
            value: total,
            color: MapCatWithColor(parseInt(categoryId)),
            text: ((total / totalSpending) * 100).toFixed(0) + '%',
            categoryId,
          });
        });
      }
    }
    setChartDataMonth(temp2);

    function sortObjectKeys(obj: any) {
      const sortedKeys = Object.keys(obj).sort((a, b) => Number(a) - Number(b)); // Sort keys in ascending order
      const sortedObject: any = {};

      sortedKeys.forEach(key => {
        sortedObject[key] = obj[key]; // Rebuild the object with sorted keys
      });

      return sortedObject;
    }
  }
  function getTotalCategorySpending(events: BudgetEvent[], selectedYear: number) {
    const totals: { [key: number]: number } = {};
    events.forEach(event => {
      const year = event.date.getFullYear();
      if (year === selectedYear) {
        // Aggregate spending by categoryId
        if (!totals[event.categoryId]) {
          totals[event.categoryId] = 0;
        }
        totals[event.categoryId] += event.amount;
      }
    });
    const temp: any = [];
    const totalSpending = Object.values(totals).reduce((sum, val) => sum + val, 0);
    Object.entries(totals).map(([categoryId, total]) => {
      temp.push({
        value: total,
        color: MapCatWithColor(parseInt(categoryId)),
        text: ((total / totalSpending) * 100).toFixed(0) + '%',
        categoryId,
      });
    });
    setChartData(temp);
    return totals;
  }
  function OpenDetailChart(chartDetail: any, date: string) {
    setDetailDate(date);
    setDetailData(chartDetail);
    setModalVisible(true);
  }
  function MapCatWithColor(id: number) {
    switch (id) {
      case 1:
        return colors.marianBlue;
      case 2:
        return colors.biceBlue;
      case 3:
        return colors.moonStone;
      case 4:
        return colors.pistachino;
      case 5:
        return colors.straw;
      case 6:
        return colors.maize;
      case 7:
        return colors.saffron;
      case 8:
        return colors.sandyBrown;
      case 9:
        return colors.burntSenna;
      case 10:
        return colors.cordovan;
      default:
        return colors.white;
    }
  }
  useFocusEffect(
    useCallback(() => {
      getTotalCategorySpending(budgetEvent, selectedYear);
      getMonthlyCategorySpending(budgetEvent, selectedYear);
    }, []),
  );
  useEffect(() => {
    getTotalCategorySpending(budgetEvent, selectedYear);
    getMonthlyCategorySpending(budgetEvent, selectedYear);
  }, [selectedYear]);
  useEffect(() => {}, [chartData, chartDataMonth]);
  return (
    <View style={[style]}>
      <Surface
        style={{
          backgroundColor: colors.darkerGray,
          borderRadius: 6,
          marginTop: 10,
          paddingTop: 6,
          paddingBottom: 10,
        }}>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
          {title || (
            <Text
              style={{
                marginLeft: 8,
                paddingTop: 1,
                color: colors.gray,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 0.75,
              }}>
              {selectedYear} categories
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingLeft: 8,
            paddingBottom: 6,
            columnGap: 10,
            width: '100%',
          }}>
          {expenseCategory.map((item, index) => (
            <View key={index} style={[{ flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
              <View
                style={{
                  width: 18,
                  borderRadius: 2,
                  height: 8,
                  backgroundColor: MapCatWithColor(parseInt(item.id.toString())),
                }}></View>
              <Text style={{ color: colors.lightGray, fontSize: 12, letterSpacing: 0.75 }}>
                {item.name}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          {chartData.length === 0 ? (
            <>
              <View
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 99,
                  alignItems: 'center',
                  backgroundColor: colors.darkGray,
                  justifyContent: 'center',
                }}>
                <Text style={{ color: colors.gray, fontWeight: 600, fontSize: 12 }}>N/A</Text>
              </View>
              <Text style={{ color: colors.gray, fontWeight: 700 }}>Year Summary</Text>
            </>
          ) : (
            <>
              <PieChart
                showText
                radius={60}
                textSize={14}
                fontWeight={'700'}
                textColor={colors.black}
                data={chartData}
                onPress={() => {
                  OpenDetailChart(chartData, 'Year summary');
                }}
              />
              <Text style={{ color: colors.gray, fontWeight: 700 }}>Year Summary</Text>
            </>
          )}
        </View>
        <Divider
          horizontalInset
          style={{ marginVertical: 12, height: 3, backgroundColor: colors.darkGray }}
        />
        <View
          style={{
            flexDirection: 'row',
            columnGap: 12,
            rowGap: 6,
            paddingHorizontal: 8,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {chartDataMonth.length === 0 ? (
            <View style={{}}>
              <Text style={{ color: colors.lightGray }}>No Data</Text>
            </View>
          ) : (
            chartDataMonth.map((item, index) => {
              if (item.length === 0) {
                return (
                  <View
                    key={index}
                    style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
                    <View
                      style={{
                        height: 56,
                        width: 56,
                        borderRadius: 99,
                        alignItems: 'center',
                        backgroundColor: colors.darkGray,
                        justifyContent: 'center',
                      }}>
                      <Text style={{ color: colors.gray, fontWeight: 600, fontSize: 12 }}>N/A</Text>
                    </View>
                    <Text
                      style={{
                        color: colors.gray,
                        fontWeight: 600,
                        fontSize: 10,
                        letterSpacing: 1,
                      }}>
                      {months[index]}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <View
                    key={index}
                    style={{
                      maxHeight: 56,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 6,
                    }}>
                    <PieChart
                      showText
                      textColor="black"
                      radius={28}
                      textSize={20}
                      data={item}
                      onPress={() => {
                        OpenDetailChart(item, months[index]);
                      }}
                    />
                    <Text
                      style={{
                        color: colors.gray,
                        fontWeight: 600,
                        fontSize: 10,
                        letterSpacing: 1,
                      }}>
                      {months[index]}
                    </Text>
                  </View>
                );
              }
            })
          )}
        </View>
      </Surface>
      <CategoryChartDetail
        date={detailDate}
        chartData={detailData}
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default CategoryChart;
