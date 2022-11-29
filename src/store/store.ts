/**
 * Package import
 */
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

/**
 * Local import
 */
import authReducer from '../features/authSlice'
import userReducer from '../features/userSlice'
import utilsReducer from '../features/utilsSlice'
import { authApi } from '@/services/authentication'
import { profilApi } from '@/services/profil'
import { communityApi } from '@/services/community'
import { whitelistApi } from '@/services/whitelist'
import { liveApi } from '@/services/live'

/**
 * Code
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    utils: utilsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profilApi.reducerPath]: profilApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [whitelistApi.reducerPath]: whitelistApi.reducer,
    [liveApi.reducerPath]: liveApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    authApi.middleware,
    profilApi.middleware,
    communityApi.middleware,
    whitelistApi.middleware,
    liveApi.middleware,
  ),
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
