import { GetGold, SaveGold } from '@/services/file.service';
import { Gold } from '@/types/budget';

let goldData: Gold[] = [];

async function AddAsset(newAsset: Gold) {
  goldData.unshift(newAsset);
  await SaveGold(goldData);
}
async function RemoveAsset(id: string) {
  const index = goldData.findIndex(item => item.id === id);
  console.log('Remove asset at index: ' + index);
  if (index > -1) {
    goldData.splice(index, 1);
    await SaveGold(goldData);
  } else {
    console.log('Remove asset fail !!!!');
  }
}
async function GetGoldFromFile() {
  const res = await GetGold();
  if (res) {
    goldData = res;
    // Object.assign(goldData, res);
  }
}
export { goldData, AddAsset, RemoveAsset, GetGoldFromFile };
