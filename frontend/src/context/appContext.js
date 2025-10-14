import io from 'socket.io-client';
import { createContext } from 'react';

export const socket = io('http://localhost:5000');


export const AppContext = createContext();


