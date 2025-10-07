import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { State, Dispatch } from '@/utils/store';

const initialState = {};
export const slice = createSlice({
  name: 'precious_metal',
  initialState,
  reducers: {},
});
// Export actions
export function usePreciousMetalSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ budget }: State) => budget);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
