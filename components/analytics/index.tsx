import { colors } from '@/theme';
import { View, Text, StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native';
import YearSummaryChart from './year_summary_chart';
import YearSummary from './year_summary';
import { Dropdown } from 'react-native-element-dropdown';
import { GetAvailableYear } from '@/local_data/data';
import { GetToday } from '@/utils/helper';
import { useCallback, useEffect, useState } from 'react';
import YearIncomeChart from './year_income_chart';
import CategoryChart from './categories_summary_chart';
import { useFocusEffect } from 'expo-router';
const styles = StyleSheet.create({
  surfaceTitle: {
    color: colors.gray,
    fontSize: 18,
    marginLeft: 0,
    letterSpacing: 1,
    fontWeight: 800,
  },
  surfaceSubTitle: {
    color: colors.gray,
    marginLeft: 0,
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: 400,
  },
  inputField: {
    width: '25%',
    height: 50,
  },
  placeholderStyle: {
    color: colors.lightGray,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: colors.white,
    fontWeight: 700,
    fontSize: 18,
  },
});
type AnalyticProps = {
  style?: StyleProp<ViewStyle>;
};
const Analytic = ({ style }: AnalyticProps) => {
  const [availableYear, setAvailableYear] = useState<{ value: number; label: string }[]>([]);
  const [selectedYear, setSelectedYear] = useState(GetToday().getFullYear());
  function GetYear() {
    const years: { value: number; label: string }[] = [];
    GetAvailableYear(true)
      .reverse()
      .forEach((item, index) => {
        years.push({ value: item, label: item.toString() });
      });
    setAvailableYear(years);
  }
  useEffect(() => {
    GetYear();
  }, []);
  useFocusEffect(
    useCallback(() => {
      setSelectedYear(GetToday().getFullYear());
    }, []),
  );
  const renderItem = (item: any) => {
    return (
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 15,
          backgroundColor: colors.blackGray,
        }}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };
  return (
    <View style={[style, { width: '100%', height: '100%', paddingHorizontal: 12 }]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          gap: 12,
        }}>
        <Text style={{ ...styles.surfaceTitle, fontSize: 16, letterSpacing: 0.75 }}>
          Select Year:
        </Text>
        <Dropdown
          style={styles.inputField}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={availableYear}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select category"
          value={selectedYear}
          renderItem={renderItem}
          onChange={item => {
            setSelectedYear(item.value);
          }}
        />
      </View>
      <Text style={{ ...styles.surfaceSubTitle, marginTop: -12, color: colors.darkGray }}>
        *Make sure a month in a year have a budget for it to appear in summary
      </Text>
      <View style={{ flex: 1, width: '100%' }}>
        <ScrollView style={{ marginTop: 12 }}>
          <YearSummary
            selectedYear={selectedYear}
            title={
              <Text
                style={{
                  marginLeft: 8,
                  paddingTop: 1,
                  color: colors.gray,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 0.75,
                }}>
                Summary
              </Text>
            }
          />
          <CategoryChart
            selectedYear={selectedYear}
            title={
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text
                  style={{
                    marginLeft: 8,
                    paddingTop: 1,
                    color: colors.gray,
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: 0.75,
                  }}>
                  Categories
                </Text>
                <Text
                  style={{
                    marginLeft: 8,
                    color: colors.gray,
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 0.75,
                  }}>
                  / expense
                </Text>
              </View>
            }
          />
          <YearSummaryChart
            selectedYear={selectedYear}
            title={
              <Text
                style={{
                  marginLeft: 8,
                  paddingTop: 1,
                  color: colors.gray,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 0.75,
                }}>
                Monthly spending
              </Text>
            }
          />
          <YearIncomeChart
            selectedYear={selectedYear}
            title={
              <Text
                style={{
                  marginLeft: 8,
                  paddingTop: 1,
                  color: colors.gray,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 0.75,
                }}>
                Monthly income
              </Text>
            }
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Analytic;
