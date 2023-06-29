import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnModuleInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected: ' + socket.id);
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ' + client.id);
  }

  emitMessage(event: string, payload: unknown) {
    this.server.emit(event, payload);
  }

  sendPrivateMessage(event: string, payload: unknown, socketId: string) {
    this.server.to(socketId).emit(event, payload);
  }

  getAllConnections() {
    return this.server.fetchSockets();
  }
}
