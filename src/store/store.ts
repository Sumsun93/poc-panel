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
import { authApi } from '@/services/authentication'
import { profilApi } from '@/services/profil'
import { communityApi } from '@/services/community'

/**
 * Code
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profilApi.reducerPath]: profilApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    authApi.middleware,
    profilApi.middleware,
    communityApi.middleware,
  ),
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
