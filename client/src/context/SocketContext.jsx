import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.token) {
      // Create new socket connection with authentication token support if needed
      const socketUrl = 'https://assignment-management-system-gbkg.onrender.com';
      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to real-time sync server');
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      // Disconnect socket if user logs out
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
