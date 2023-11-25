import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import localStorageMiddleware from './middlewares/localStorageMiddleware';
import authSlice from './slices/authSlice';
import menuSlice from './slices/menuSlice';
import sessionStorageMiddleware from './middlewares/sessionStorageMiddleware';
import toolsCatalogSlice from './slices/toolsCatalogSlice';
import meSlice from './slices/meSlice';
import cartSlice from './slices/cartSlice';
import bookingsSlice from './slices/bookingsSlice';

const loadStoreState: any = () => {
  const parsedObj: any = {}

  Object.keys({ ...localStorage, ...sessionStorage }).forEach((k) => {
    let str: string | null = null

    if (Object.keys(localStorage).includes(k)) {
      str = localStorage.getItem(k)
    }
    if (Object.keys(sessionStorage).includes(k)) {
      str = sessionStorage.getItem(k)
    }

    if (str !== null) {
      parsedObj[k] = JSON.parse(str)
    }
  })
  return parsedObj
}

export const store = configureStore({
  reducer: {
    auth: authSlice,
    menu: menuSlice,
    toolsCatalog: toolsCatalogSlice,
    me: meSlice,
    cart: cartSlice,
    bookings: bookingsSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    logger,
    localStorageMiddleware,
    sessionStorageMiddleware,
  ),
  preloadedState: loadStoreState(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
