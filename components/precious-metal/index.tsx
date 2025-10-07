import { getAllFiles } from '@/services';
import { colors } from '@/theme';
import { router, useFocusEffect } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    height: 44,
    width: '50%',
    backgroundColor: colors.lightPurple,
  },
});
const PreciousMetalList = () => {
  useEffect(() => {}, []);
  useFocusEffect(() => {
    getAllFiles();
  });
  return (
    <View>
      <Text style={[styles.title]}>PreciousMetal</Text>
      <Button
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: '(main)/(tabs)/precious-metal/details',
            params: { from: 'Details' },
          })
        }>
        <></>
      </Button>
    </View>
  );
};

export default PreciousMetalList;
