import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';

let socketInstance = null;

export function useSocket() {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && !socketInstance) {
      socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        withCredentials: true,
      });

      socketInstance.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      setSocket(socketInstance);
    } else if (isAuthenticated && socketInstance) {
      setSocket(socketInstance);
    }

    if (!isAuthenticated && socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      setSocket(null);
    }

    return () => {
      // Don't disconnect on hook unmount if we're still authenticated
      // Let the auth state changes manage the connection lifecycle
    };
  }, [isAuthenticated]);

  return socket;
}
