import io from 'socket.io-client';
import { createContext } from 'react';
const url = import.meta.env.VITE_API_URL

export const socket = io(url);


export const AppContext = createContext();


