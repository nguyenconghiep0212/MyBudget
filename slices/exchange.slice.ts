import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { State, Dispatch } from '@/utils/store';
import { BANKENUM, BIDVBank, ExchangeRateTable, VietcomBank, VPBank } from '@/types/exchange';

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
  },
});
// Export actions
export function useExchangeSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ exchange }: State) => exchange);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
