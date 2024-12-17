import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import socketMiddleware from './middleware/socketMiddleware';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['meta.remote'],
        ignoredPaths: ['socket'],
        warnAfter: 128,
      },
      immutableCheck: false,
    }).concat(socketMiddleware()),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
