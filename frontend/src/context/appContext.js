import io from 'socket.io-client';
import { createContext } from 'react';
const url =  'http://localhost:5000';

export const socket = io(url);


export const AppContext = createContext();


