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
export interface UserState {
  insertionTime: string;
  socialclubName: string;
  whitelistStatut: string;
  whitelistNumber: number;
  adastra: number;
  rights: {
    memberlist: boolean;
    globalmap: boolean;
    dowhitelist: boolean;
    discordaccess: boolean;
  };
}

const initialState: UserState = {
  insertionTime: '',
  socialclubName: '',
  whitelistStatut: '',
  whitelistNumber: 0,
  adastra: 0,
  rights: { memberlist: false, globalmap: false, dowhitelist: false, discordaccess: false },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const { insertionTime, socialclubName, whitelistStatut, whitelistNumber, adastra } = action.payload
      state.insertionTime = insertionTime
      state.socialclubName = socialclubName
      state.whitelistStatut = whitelistStatut
      state.whitelistNumber = whitelistNumber
      state.adastra = adastra
    },
    setRights: (state, action: PayloadAction<UserState['rights']>) => {
      state.rights = {
        ...state.rights,
        ...action.payload,
      }
    },
  },
})

export const { setUser, setRights } = userSlice.actions

export default userSlice.reducer
