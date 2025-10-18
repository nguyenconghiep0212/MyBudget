import { GetGold, SaveGold } from '@/services/file.service';
import { Gold } from '@/types/budget';

const goldData: Gold[] = [
  // {
  //   id: '1',
  //   own: 2,
  //   category: 1,
  //   priceAtBought: 180_000_000,
  // },
  // {
  //   id: '2',
  //   own: 1,
  //   category: 49,
  //   priceAtBought: 136_000_000,
  // },
];

// VNAppMob
// const goldCategories = ['1l', '5c', '1c', 'nhan1c', 'nutrang_9999', 'nutrang_99', 'nutrang_75'];
// function GetCategoryName(id: string): string {
//   switch (id) {
//     case '1l':
//       return 'Bar (1 tael)';
//     case '5c':
//       return 'Bar (5 mace)';
//     case '1c':
//       return 'Bar (1 mace)';
//     case 'nhan1c':
//       return 'Ring (1 mace)';
//     case 'nutrang_9999':
//       return 'Jewlry 99,99';
//     case 'nutrang_99':
//       return 'Jewlry 99';
//     case 'nutrang_75':
//       return 'Jewlry 75';
//     default:
//       return id;
//   }
// }

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
    Object.assign(goldData, res);
  }
}
export { goldData, AddAsset, RemoveAsset, GetGoldFromFile };
