import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { State, Dispatch } from '@/utils/store';

const initialState = {
  refreshGoldPrice: false,
  refreshKey: false,
  availableKey: false,
  loadingDataApi: false,
  loadingKeyApi: false,
};
export const slice = createSlice({
  name: 'precious_metal',
  initialState,
  reducers: {
    RefreshGoldPrice(state) {
      state.refreshGoldPrice = !state.refreshGoldPrice;
    },
    RefreshKey(state) {
      state.refreshKey = !state.refreshKey;
    },
    setKeyAvailability(state, action) {
      state.availableKey = action.payload;
    },
    DataApiLoading(state) {
      state.loadingDataApi = true;
    },
    DataApiLoaded(state) {
      state.loadingDataApi = false;
    },
    KeyApiLoading(state) {
      state.loadingKeyApi = true;
    },
    KeyApiLoaded(state) {
      state.loadingKeyApi = false;
    },
  },
});
// Export actions
export function usePreciousMetalSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ precious_metal }: State) => precious_metal);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
