import * as jwt from 'jsonwebtoken';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketNotifierPort } from '../../application/ports/websocket-notifier.port';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/ws',
})
export class PetGateway implements OnGatewayConnection, OnGatewayDisconnect, WebSocketNotifierPort {
  @WebSocketServer()
  server!: Server;

  private userSockets = new Map<string, string[]>();
  private petRooms = new Map<string, Set<string>>();

  handleConnection(client: Socket): void {
    const token = client.handshake.query.token as string;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret');
      const userId = payload.sub as string;
      client.data.userId = userId;

      const sockets = this.userSockets.get(userId) ?? [];
      sockets.push(client.id);
      this.userSockets.set(userId, sockets);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = client.data.userId;
    if (userId) {
      const sockets = this.userSockets.get(userId) ?? [];
      this.userSockets.set(
        userId,
        sockets.filter((s) => s !== client.id),
      );
      if (this.userSockets.get(userId)?.length === 0) {
        this.userSockets.delete(userId);
      }
    }

    this.petRooms.forEach((sockets, petId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.petRooms.delete(petId);
      }
    });
  }

  @SubscribeMessage('pet:join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { petId: string }): void {
    const room = `pet:${data.petId}`;
    client.join(room);

    const sockets = this.petRooms.get(data.petId) ?? new Set();
    sockets.add(client.id);
    this.petRooms.set(data.petId, sockets);
  }

  @SubscribeMessage('pet:leave-room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { petId: string }): void {
    const room = `pet:${data.petId}`;
    client.leave(room);

    const sockets = this.petRooms.get(data.petId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.petRooms.delete(data.petId);
      }
    }
  }

  notifyPetState(petId: string, state: Record<string, unknown>): void {
    this.server.to(`pet:${petId}`).emit('pet:state', { petId, ...state });
  }

  notifyPetFed(petId: string, userId: string, hunger: number): void {
    this.server.to(`pet:${petId}`).emit('pet:fed', { petId, userId, hunger, timestamp: new Date() });
  }

  notifyPetPlayed(petId: string, userId: string, happiness: number): void {
    this.server.to(`pet:${petId}`).emit('pet:played', { petId, userId, happiness, timestamp: new Date() });
  }

  notifyPetBathed(petId: string, userId: string, hygiene: number): void {
    this.server.to(`pet:${petId}`).emit('pet:bathed', { petId, userId, hygiene, timestamp: new Date() });
  }

  notifyPetEvolved(petId: string, newLevel: number): void {
    this.server.to(`pet:${petId}`).emit('pet:evolved', { petId, newLevel, timestamp: new Date() });
  }

  notifyPetMoodChange(petId: string, oldMood: string, newMood: string): void {
    this.server
      .to(`pet:${petId}`)
      .emit('pet:mood-change', { petId, oldMood, newMood, timestamp: new Date() });
  }

  notifyPartnerAction(userId: string, type: string, petId: string): void {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit('couple:partner-action', {
          type,
          petId,
          timestamp: new Date(),
        });
      });
    }
  }

  notifyError(userId: string, code: string, message: string): void {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit('error', { code, message, timestamp: new Date() });
      });
    }
  }
}
