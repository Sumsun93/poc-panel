/**
 * Package import
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 * Local import
 */

/**
 * Code
 */
export interface AuthState {
  connected: boolean;
  isRegistering: boolean;
  token: string;
}

const initialState: AuthState = {
  connected: false,
  isRegistering: false,
  token: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
    },
    setIsRegistering: (state, action: PayloadAction<boolean>) => {
      state.isRegistering = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    disconnect: (state) => {
      state.connected = false
      state.token = ''
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    },
  },
})

export const { setConnected, setIsRegistering, setToken, disconnect } = authSlice.actions

export default authSlice.reducer
