/**
 * Package import
 */
import { createSlice } from '@reduxjs/toolkit'

/**
 * Local import
 */

/**
 * Code
 */
export interface UtilsState {
  toastValue: any;
}

const initialState: UtilsState = {
  toastValue: null,
}

export const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toastValue = action.payload
    },
  },
})

export const { showToast } = utilsSlice.actions

export default utilsSlice.reducer
