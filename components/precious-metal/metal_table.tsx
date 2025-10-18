/* eslint-disable react-hooks/exhaustive-deps */
import { fetchGoldPriceSJC } from '@/services';
import { colors } from '@/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import { Gold } from '@/types/budget';
import { goldData, RemoveAsset } from '@/local_data/assets';
import { usePreciousMetalSlice } from '@/slices';
import { formatCurrency } from '@/utils/helper';
import MetalTableAdd from './metal_table_Add';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Confirmation from '../_common/confirmation';
import { SJC } from '@/types/gold';
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
    paddingHorizontal: 4,
  },
  superItemContainer: {
    display: 'flex',
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
    justifyContent: 'center',
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
  category: number;
  priceAtBought: number;
  priceCurrent: number;
  discrepancy: number;
}
const MetalTable = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [goldPrice, setGoldPrice] = useState<{
    data: SJC[];
    latestDate: string;
    success: boolean;
  }>({ data: [], latestDate: '', success: true });
  const { dispatch, refreshGoldPrice, DataApiLoading, DataApiLoaded } = usePreciousMetalSlice();
  const [removalItem, setRemovalItem] = useState<Gold>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);

  async function MapTableData() {
    const result: TableData[] = [];
    console.log('Got gold data from file');
    goldData.forEach((item: Gold) => {
      const temp = goldPrice.data.find((item2: SJC, index: number) => item2.Id === item.category);
      const priceCurrent = temp ? temp.BuyValue : 0;
      const discrepancy = priceCurrent - item.priceAtBought;
      result.push({
        ...item,
        priceCurrent,
        discrepancy,
      });
    });
    setTableData(result);
  }

  function GetGoldCategoryFromId(id: number) {
    if (goldPrice) {
      return goldPrice.data.find((item: SJC) => item.Id === id);
    } else return null;
  }
  async function GetGoldPrice() {
    try {
      dispatch(DataApiLoading());
      const res = await fetchGoldPriceSJC();
      if (res) {
        setGoldPrice(res);
        dispatch(DataApiLoaded());
      }
    } catch (error) {
      dispatch(DataApiLoaded());
      console.error(error);
    }
  }
  async function onDeleteGold(id: string) {
    await RemoveAsset(id);
    setRefreshTable(!refreshTable);
  }
  useEffect(() => {
    console.log('======================================');
    GetGoldPrice();
  }, [refreshGoldPrice]);
  useEffect(() => {
    console.log('---------------------');
    MapTableData();
  }, [goldPrice, refreshTable]);
  return (
    <View style={{ marginTop: 12 }}>
      <View style={styles.superContainer}>
        <View style={{ ...styles.superItemContainer, alignContent: 'flex-start' }}>
          <Text style={{ color: colors.gray, marginTop: 8, fontSize: 10 }}>
            Own unit:
            <Text style={{ fontWeight: 800 }}> 1 chỉ </Text>
          </Text>
          <Text style={{ color: colors.gray, marginTop: 8, fontSize: 10 }}>
            Price unit:
            <Text style={{ fontWeight: 800 }}> 1 lượng ( 10 chỉ )</Text>
          </Text>
        </View>
        <View style={{ ...styles.superItemContainer, alignContent: 'flex-end' }}>
          <Button
            mode="outlined"
            style={{ width: 120, alignSelf: 'flex-end' }}
            onPress={() => setModalVisible(true)}>
            <Text style={{ color: colors.lightGray }}>Add gold</Text>
          </Button>
        </View>
      </View>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ maxWidth: 30, justifyContent: 'flex-start' }}>
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
            <DataTable.Cell style={{ maxWidth: 30, justifyContent: 'flex-start' }}>
              <Text style={{ color: colors.gold, fontSize: 12, fontWeight: 800 }}>{item.own}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ maxWidth: 92, justifyContent: 'center' }}>
              <Text style={{ color: colors.lightGray, fontSize: 8 }}>
                {GetGoldCategoryFromId(item.category)?.TypeName || 'N/A'}
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
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ maxWidth: 30, justifyContent: 'flex-start' }}>
            <Text style={[styles.TableTitle]}>Total</Text>
          </DataTable.Title>
          <DataTable.Title style={{ maxWidth: 92, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle, { color: colors.darkGray }]}>N/A</Text>
          </DataTable.Title>
          <DataTable.Title numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Total</Text>
          </DataTable.Title>
          <DataTable.Title
            numeric
            style={{ maxWidth: 90, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Text style={[styles.TableTitle, { color: colors.darkGray }]}>N/A</Text>
          </DataTable.Title>
          <DataTable.Title numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>Discrepancy</Text>
          </DataTable.Title>
          <DataTable.Title numeric style={{ maxWidth: 12, justifyContent: 'center' }}>
            <Text style={[styles.TableTitle]}>#</Text>
          </DataTable.Title>
        </DataTable.Header>

        <DataTable.Row
          style={{
            backgroundColor: colors.blackGray,
          }}>
          <DataTable.Cell style={{ maxWidth: 30, justifyContent: 'flex-start' }}>
            <Text style={{ color: colors.gold, fontSize: 12, fontWeight: 800 }}>
              {tableData.reduce((total, current) => total + current.own, 0)}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ maxWidth: 92, justifyContent: 'center' }}>
            <Text style={{ ...styles.TableTitle, color: colors.darkGray }}>N/A</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
            <Text
              style={{
                fontWeight: 800,
                fontSize: 9,
                letterSpacing: 0.5,
                color: colors.NavyBlueText,
              }}>
              {formatCurrency(
                tableData.reduce(
                  (total, current) => total + current.priceAtBought * current.own,
                  0,
                ),
              )}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
            <Text
              style={{
                fontWeight: 800,
                fontSize: 9,
                letterSpacing: 0.5,
                color: colors.Positive,
              }}>
              {formatCurrency(
                tableData.reduce((total, current) => total + current.priceCurrent * current.own, 0),
              )}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell numeric style={{ maxWidth: 90, justifyContent: 'center' }}>
            <Text
              style={{
                fontWeight: 800,
                fontSize: 9,
                letterSpacing: 0.5,
                color:
                  tableData.reduce(
                    (total, current) => total + current.priceCurrent * current.own,
                    0,
                  ) -
                    tableData.reduce(
                      (total, current) => total + current.priceAtBought * current.own,
                      0,
                    ) >
                  0
                    ? colors.Positive
                    : colors.Negative,
              }}>
              {formatCurrency(
                tableData.reduce(
                  (total, current) => total + current.priceCurrent * current.own,
                  0,
                ) -
                  tableData.reduce(
                    (total, current) => total + current.priceAtBought * current.own,
                    0,
                  ),
              )}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ maxWidth: 12, justifyContent: 'center' }}>
            {tableData.reduce((total, current) => total + current.discrepancy, 0) > 0 ? (
              <Entypo name="arrow-up" size={12} color={colors.Positive} />
            ) : (
              <Entypo name="arrow-down" size={12} color={colors.Negative} />
            )}
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <MetalTableAdd
        modalVisible={modalVisible}
        dataGoldPriceAPI={goldPrice.data}
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
                  <Text style={{ color: colors.lightGray, maxWidth: 120, flexShrink: 1 }}>
                    {GetGoldCategoryFromId(removalItem.category)?.TypeName || 'N/A'}
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
