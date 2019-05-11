import React from 'react';
import openSocket from 'socket.io-client'


export const socket = openSocket('http://localhost:9000');



export const SocketContext = React.createContext(socket.id);
