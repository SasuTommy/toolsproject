import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';
import { AnyAction, MiddlewareArray, ThunkMiddleware, Middleware, Dispatch } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { AuthState } from './store/slices/authSlice';
import { injectStoreForAxios } from './api/axiosClient';

const container = document.getElementById('root')!;
const root = createRoot(container);

injectStore(store)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);


function injectStore(store: any) {
  injectStoreForAxios(store)
}

