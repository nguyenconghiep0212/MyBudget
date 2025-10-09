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

export { goldData, goldCategories };
