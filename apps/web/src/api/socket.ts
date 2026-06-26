import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (socket) return socket;

  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return null;

  socket = io('http://localhost:3000', {
    auth: { token: accessToken },
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
