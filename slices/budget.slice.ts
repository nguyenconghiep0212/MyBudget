import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { State, Dispatch } from '@/utils/store';

const initialState = {
  viewMode: 'detail', // summary | detail
};
export const slice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    ChangeViewMode(state) {
      if (state.viewMode === 'summary') {
        state.viewMode = 'detail';
      } else if (state.viewMode === 'detail') {
        state.viewMode = 'summary';
      }
    },
  },
});
// Export actions
export function useBudgetSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ budget }: State) => budget);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
