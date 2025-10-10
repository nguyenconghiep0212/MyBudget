import { Gold } from '@/types/budget';

const goldData: Gold[] = [
  {
    own: 2,
    category: 'nhan1c',
    priceAtBought: 180_000_000,
  },
  {
    own: 1,
    category: '5c',
    priceAtBought: 136_000_000,
  },
];

const goldCategories = ['1l', '5c', '1c', 'nhan1c', 'nutrang_9999', 'nutrang_99', 'nutrang_75'];
function GetCategoryName(id: string): string {
  switch (id) {
    case '1l':
      return 'Bar (1 tael)';
    case '5c':
      return 'Bar (5 mace)';
    case '1c':
      return 'Bar (1 mace)';
    case 'nhan1c':
      return 'Ring (1 mace)';
    case 'nutrang_9999':
      return 'Jewlry 9999';
    case 'nutrang_99':
      return 'Jewlry 99';
    case 'nutrang_75':
      return 'Jewlry 75';
    default:
      return id;
  }
}

export { goldData, goldCategories, GetCategoryName };
