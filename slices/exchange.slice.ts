import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { State, Dispatch } from '@/utils/store';
import { BANKENUM, BIDVBank, ExchangeRateItem, VietcomBank, VPBank } from '@/types/exchange';

const initialState = {
  refreshExchangeRate: false,
  loadingDataApi: false,
  selectedBank: BANKENUM.VIETCOMBANK,
  VPBankExchangeRate: { effectiveTime: '', effectiveDate: '', exchangeRates: [] } as VPBank,
  BIDVBankExchangeRate: {
    hour: '',
    day_vi: '',
    data: [],
    note_vi: '',
    note_en: '',
  } as BIDVBank,
  VietcomBankExchangeRate: { UpdatedDate: '', Data: [] } as VietcomBank,
  lastUpdateTime: '',
  exchangeRateList: [
    {
      currencyCode: 'VND',
      rates: [
        {
          bank: BANKENUM.VPBANK,
          buyRateCash: 1,
          buyRateTransfer: 1,
          sellRateCash: 1,
          sellRateTransfer: 1,
        },
        {
          bank: BANKENUM.BIDV,
          buyRateCash: 1,
          buyRateTransfer: 1,
          sellRateCash: 1,
          sellRateTransfer: 1,
        },
        {
          bank: BANKENUM.VIETCOMBANK,
          buyRateCash: 1,
          buyRateTransfer: 1,
          sellRateCash: 1,
          sellRateTransfer: 1,
        },
      ],
    },
  ] as ExchangeRateItem[],
};
export const slice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    RefreshExchangePrice(state) {
      state.refreshExchangeRate = !state.refreshExchangeRate;
    },
    DataApiLoading(state) {
      state.loadingDataApi = true;
    },
    DataApiLoaded(state) {
      state.loadingDataApi = false;
    },
    SetVPBankExchangeRate(state, action) {
      state.VPBankExchangeRate = action.payload;
    },
    SetBIDVBankExchangeRate(state, action) {
      state.BIDVBankExchangeRate = action.payload;
    },
    SetVietcomBankExchangeRate(state, action) {
      state.VietcomBankExchangeRate = action.payload;
    },
    SetSelectedBank(state, action) {
      state.selectedBank = action.payload;
    },
    SetLastUpdateTime(state, action) {
      state.lastUpdateTime = action.payload;
    },
    SetExchangeRateItems(state) {
      state.exchangeRateList = [
        {
          currencyCode: 'VND',
          rates: [
            {
              bank: BANKENUM.VPBANK,
              buyRateCash: 1,
              buyRateTransfer: 1,
              sellRateCash: 1,
              sellRateTransfer: 1,
            },
            {
              bank: BANKENUM.BIDV,
              buyRateCash: 1,
              buyRateTransfer: 1,
              sellRateCash: 1,
              sellRateTransfer: 1,
            },
            {
              bank: BANKENUM.VIETCOMBANK,
              buyRateCash: 1,
              buyRateTransfer: 1,
              sellRateCash: 1,
              sellRateTransfer: 1,
            },
          ],
        },
      ];
      state.VPBankExchangeRate.exchangeRates.forEach((item: any) => {
        if (item.currency !== 'XAU') {
          state.exchangeRateList.push({
            currencyCode: item.currency,
            rates: [
              {
                bank: BANKENUM.VPBANK,
                buyRateCash: item.buyCash,
                buyRateTransfer: item.buyTransfer,
                sellRateCash: item.sellCash,
                sellRateTransfer: item.sellTransfer,
              },
            ],
          });
        }
      });
      state.BIDVBankExchangeRate.data.forEach((item: any) => {
        if (item.currency !== 'USD(10-20)' && item.currency !== 'USD(1-2-5)') {
          const existed = state.exchangeRateList.find(i => i.currencyCode === item.currency);
          if (existed) {
            existed.rates.push({
              bank: BANKENUM.BIDV,
              buyRateCash: parseFloat(item.muaTm.split(',').join('')),
              buyRateTransfer: parseFloat(item.muaCk.split(',').join('')),
              sellRateCash: parseFloat(item.ban.split(',').join('')),
              sellRateTransfer: parseFloat(item.ban.split(',').join('')),
            });
          } else {
            state.exchangeRateList.push({
              currencyCode: item.currency,
              rates: [
                {
                  bank: BANKENUM.BIDV,
                  buyRateCash: parseFloat(item.muaTm.split(',').join('')),
                  buyRateTransfer: parseFloat(item.muaCk.split(',').join('')),
                  sellRateCash: parseFloat(item.ban.split(',').join('')),
                  sellRateTransfer: parseFloat(item.ban.split(',').join('')),
                },
              ],
            });
          }
        }
      });
      state.VietcomBankExchangeRate.Data.forEach(item => {
        const existed = state.exchangeRateList.find(i => i.currencyCode === item.currencyCode);
        if (existed) {
          existed.rates.push({
            bank: BANKENUM.VIETCOMBANK,
            buyRateCash: parseFloat(item.cash.split(',').join('')),
            buyRateTransfer: parseFloat(item.transfer.split(',').join('')),
            sellRateCash: parseFloat(item.sell.split(',').join('')),
            sellRateTransfer: parseFloat(item.sell.split(',').join('')),
          });
        } else {
          state.exchangeRateList.push({
            currencyCode: item.currencyCode,
            rates: [
              {
                bank: BANKENUM.VIETCOMBANK,
                buyRateCash: parseFloat(item.cash.split(',').join('')),
                buyRateTransfer: parseFloat(item.transfer.split(',').join('')),
                sellRateCash: parseFloat(item.sell.split(',').join('')),
                sellRateTransfer: parseFloat(item.sell.split(',').join('')),
              },
            ],
          });
        }
      });
    },
  },
});
// Export actions
export function useExchangeSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ exchange }: State) => exchange);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
