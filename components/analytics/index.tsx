import { colors } from '@/theme';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import YearSummaryChart from './year_summary_chart';
import YearSummary from './year_summary';
import { Dropdown } from 'react-native-element-dropdown';
import { GetAvailableYear } from '@/local_data/data';
import { GetToday } from '@/utils/helper';
import { useEffect, useState } from 'react';
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
    GetAvailableYear()
      .reverse()
      .forEach((item, index) => {
        years.push({ value: item, label: item.toString() });
      });
    setAvailableYear(years);
  }
  useEffect(() => {
    GetYear();
  }, []);
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
    <View style={[style, { width: '100%', paddingHorizontal: 12 }]}>
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
      <View style={{ marginTop: 12 }}>
        <YearSummaryChart selectedYear={selectedYear} />
        <YearSummary selectedYear={selectedYear} />
      </View>
    </View>
  );
};

export default Analytic;
