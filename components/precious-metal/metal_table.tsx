/* eslint-disable react-hooks/exhaustive-deps */
import { fetchGoldPrice, GOLD_BRAND, refreshApiKey } from '@/services';
import { colors } from '@/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import { Gold } from '@/types/budget';
import { GetCategoryName, goldData, RemoveAsset } from '@/local_data/assets';
import { usePreciousMetalSlice } from '@/slices';
import { formatCurrency } from '@/utils/helper';
import MetalTableAdd from './metal_table_Add';
import { Ionicons } from '@expo/vector-icons';
import Confirmation from '../_common/confirmation';
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
  const {
    dispatch,
    refreshGoldPrice,
    refreshKey,
    DataApiLoading,
    DataApiLoaded,
    setKeyAvailability,
    KeyApiLoaded,
    KeyApiLoading,
  } = usePreciousMetalSlice();
  const [removalItem, setRemovalItem] = useState<Gold>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);

  function MapTableData() {
    const result: TableData[] = [];
    goldData.forEach((item: Gold) => {
      const temp = Object.entries(goldPrice).find(([key, value]) => key === `buy_${item.category}`);
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
    try {
      dispatch(DataApiLoading());
      const res = await fetchGoldPrice(brand);
      if (res) {
        setGoldPrice(res[0]);
        dispatch(DataApiLoaded());
      }
    } catch (error) {
      dispatch(DataApiLoaded());
      dispatch(setKeyAvailability(false));
      console.error(error);
    }
  }
  function onDeleteGold(id: string) {
    RemoveAsset(id);
    setRefreshTable(!refreshTable);
  }
  async function ResetGoldApiKey() {
    try {
      dispatch(KeyApiLoading());
      await refreshApiKey();
      dispatch(KeyApiLoaded());
      dispatch(setKeyAvailability(true));
    } catch (error) {
      dispatch(KeyApiLoaded());
      dispatch(setKeyAvailability(false));
      console.error(error);
    }
  }
  useEffect(() => {
    GetGoldPrice(GOLD_BRAND.SJC);
    MapTableData();
  }, [refreshGoldPrice]);
  useEffect(() => {
    MapTableData();
  }, [goldPrice, refreshTable]);
  useEffect(() => {
    ResetGoldApiKey();
  }, [refreshKey]);
  return (
    <View style={{ marginTop: 12 }}>
      <Button
        mode="outlined"
        style={{ width: 120, alignSelf: 'flex-end' }}
        onPress={() => setModalVisible(true)}>
        <Text style={{ color: colors.lightGray }}>Add gold</Text>
      </Button>
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
          <DataTable.Title numeric style={{ maxWidth: 12, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>#</Text>
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
                  color: colors.Positive,
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
            <DataTable.Cell style={{ maxWidth: 12, justifyContent: 'center' }}>
              <Ionicons
                name="trash-bin"
                size={10}
                color={colors.Negative}
                onPress={() => {
                  setRemovalItem(item);
                  setConfirmVisible(true);
                }}
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <View></View>
      <MetalTableAdd
        modalVisible={modalVisible}
        dataGoldPriceAPI={goldPrice}
        onClose={() => setModalVisible(false)}
        onRefreshData={() => setRefreshTable(!refreshTable)}
      />
      <Confirmation
        modalOption={{
          title: 'Removal confirm',
          body: (
            <View>
              <Text style={{ color: colors.gray }}>You want to remove this asset ?</Text>
              {removalItem && (
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                  <Text style={{ color: colors.lightGray }}>{removalItem.own}</Text>
                  <Text style={{ color: colors.lightGray }}>
                    {GetCategoryName(removalItem.category)}
                  </Text>
                  <Text style={{ color: colors.lightGray }}>at</Text>
                  <Text style={{ color: colors.NavyBlueText }}>
                    {formatCurrency(removalItem.priceAtBought)}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
        modalVisible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={() => {
          if (removalItem) onDeleteGold(removalItem.id);
          setConfirmVisible(false);
        }}
      />
    </View>
  );
};

export default MetalTable;
