import { colors } from '@/theme';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
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
type AnalyticProps = {
  style?: StyleProp<ViewStyle>;
};
const Analytic = ({ style }: AnalyticProps) => {
  return (
    <View style={[style]}>
      <Text>Analytic Screen</Text>
    </View>
  );
};

export default Analytic;
