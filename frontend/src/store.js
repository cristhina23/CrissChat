import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import appApi from './services/appApi';

// Persisting user data in local storage
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

//  Combinar reducers
const reducers = combineReducers({
  user: userReducer,
  [appApi.reducerPath]: appApi.reducer,
});

//  Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  blacklist: [appApi.reducerPath], // no guardar cache de RTK Query
};

const persistedReducer = persistReducer(persistConfig, reducers);

//  Crear store correctamente
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // evita errores con redux-persist
    }).concat(appApi.middleware),
});

//  Crear persistor (para mantener el estado guardado)
export const persistor = persistStore(store);
