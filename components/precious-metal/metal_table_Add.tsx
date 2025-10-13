import { AddAsset } from '@/local_data/assets';
import { colors } from '@/theme';
import { Gold } from '@/types/budget';
import { SJC } from '@/types/gold';
import { formatCurrency, GetToday } from '@/utils/helper';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, StyleProp, TextInput, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Checkbox, Dialog, Portal } from 'react-native-paper';
const styles = StyleSheet.create({
  body: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
  portal: {
    marginTop: -70,
    fontSize: 28,
    fontWeight: 500,
    backgroundColor: colors.blackGray,
  },
  portalBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputTitle: { color: colors.lightGray, fontSize: 14 },
  inputField: {
    width: '100%',
    height: 40,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: colors.blackGray,
    color: colors.white,
  },
  placeholderStyle: {
    color: colors.darkGray,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: colors.white,
    fontSize: 16,
  },
});
type GoldAddProps = {
  style?: StyleProp<ViewStyle>;
  modalVisible: boolean;
  dataGoldPriceAPI: SJC[];
  onClose: () => void;
  onRefreshData: () => void;
};
const MetalTableAdd = ({
  style,
  dataGoldPriceAPI,
  modalVisible,
  onClose,
  onRefreshData,
}: GoldAddProps) => {
  const [isUseCurrentPrice, setIsUseCurrentPrice] = useState(true);
  const [newGold, setNewGold] = useState<Gold>({ id: '', own: 0, category: 0, priceAtBought: 0 });
  const [goldCategory, setGoldCategory] = useState<any>();
  function setGoldCat() {
    const temp: any = [];
    dataGoldPriceAPI.forEach((item: SJC) => {
      if (item.BranchName === 'Hồ Chí Minh') {
        temp.push({
          value: item.Id,
          label: item.TypeName,
          price: item.SellValue,
        });
      }
    });
    setGoldCategory(temp);
  }
  function GetGoldCategoryFromId(id: number) {
    if (goldCategory) {
      return goldCategory.find((item: any) => item.value === id);
    } else return null;
  }
  function resetNewGold() {
    setNewGold({ id: '', own: 0, category: 0, priceAtBought: 0 });
  }
  function AddToAsset() {
    if (isUseCurrentPrice) {
      const temp = dataGoldPriceAPI.find((item: SJC) => item.Id === newGold.category);
      newGold.id = GetToday().getTime().toString();
      newGold.priceAtBought = temp ? temp.SellValue : 0;
    }
    AddAsset(newGold);

    resetNewGold();
    onClose();
    onRefreshData();
  }
  useEffect(() => {}, [goldCategory, newGold]);
  useEffect(() => {
    setGoldCat();
  }, [dataGoldPriceAPI]);

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
    <View>
      <Portal>
        <Dialog visible={modalVisible} style={styles.portal} onDismiss={onClose}>
          <Dialog.Content style={styles.portalBody}>
            <Text style={[{ fontSize: 24, color: colors.lightGray, marginBottom: 8 }]}>
              Add gold
            </Text>

            <View style={{ width: '100%', gap: 20 }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.inputTitle}>Own:</Text>
                  <Text style={{ ...styles.inputTitle, color: colors.gray, fontSize: 11 }}>
                    1 lượng = 10 | 1 chỉ = 1
                  </Text>
                </View>
                <TextInput
                  placeholderTextColor={colors.darkGray}
                  placeholder="Enter number of item..."
                  style={[styles.inputField]}
                  value={newGold.own ? newGold.own.toString() : ''}
                  keyboardType="numeric"
                  onChangeText={event => {
                    setNewGold({
                      ...newGold,
                      own: parseFloat(event),
                    });
                  }}
                />
              </View>
              <View>
                <Text style={styles.inputTitle}>Gold categories:</Text>
                <Dropdown
                  style={styles.inputField}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={goldCategory}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select category..."
                  value={newGold.category}
                  renderItem={renderItem}
                  onChange={item => {
                    setNewGold({
                      ...newGold,
                      category: item.value,
                    });
                  }}
                />
              </View>
              <View>
                <Text style={styles.inputTitle}>Price upon purchase:</Text>
                <View style={{ marginLeft: -8, flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    color={colors.NavyBlueText}
                    status={isUseCurrentPrice ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setIsUseCurrentPrice(!isUseCurrentPrice);
                    }}
                  />
                  <Text style={{ marginLeft: -4, color: colors.gray, fontSize: 12 }}>
                    use current price
                  </Text>
                </View>
                {isUseCurrentPrice ? (
                  <View>
                    {GetGoldCategoryFromId(newGold.category) ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text
                          style={{
                            color: colors.Negative,
                            fontSize: 16,
                            fontWeight: 700,
                            letterSpacing: 1,
                          }}>
                          {formatCurrency(parseInt(GetGoldCategoryFromId(newGold.category).price))}
                        </Text>
                        <Text
                          style={{
                            color: colors.gray,
                            fontSize: 16,
                            fontWeight: 700,
                            letterSpacing: 1,
                          }}>
                          {' vnd'}
                        </Text>
                      </View>
                    ) : (
                      <Text style={{ color: colors.darkGray }}>N/A</Text>
                    )}
                  </View>
                ) : (
                  <TextInput
                    placeholderTextColor={colors.darkGray}
                    placeholder="Enter price when bought item..."
                    style={[styles.inputField]}
                    value={newGold.priceAtBought ? newGold.priceAtBought.toString() : ''}
                    keyboardType="numeric"
                    onChangeText={event => {
                      setNewGold({
                        ...newGold,
                        priceAtBought: parseFloat(event),
                      });
                    }}
                  />
                )}
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onClose}>
              <Text style={{ color: colors.Negative }}>Cancel</Text>
            </Button>
            <Button
              onPress={() => {
                AddToAsset();
              }}>
              <Text style={{ color: colors.NavyBlueText }}>Confirm</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default MetalTableAdd;
