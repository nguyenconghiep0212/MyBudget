import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { State, Dispatch } from '@/utils/store';

const initialState = {
  refreshGoldPrice: false,
};
export const slice = createSlice({
  name: 'precious_metal',
  initialState,
  reducers: {
    RefreshGoldPrice(state) {
      state.refreshGoldPrice = !state.refreshGoldPrice;
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
