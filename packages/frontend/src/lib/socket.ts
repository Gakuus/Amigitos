import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3001';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    socket = io(`${WS_URL}/ws`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function connectToPetRoom(petId: string): Socket {
  const s = getSocket();
  s.emit('pet:join-room', { petId });
  return s;
}

export function disconnectFromPetRoom(petId: string): void {
  getSocket().emit('pet:leave-room', { petId });
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
