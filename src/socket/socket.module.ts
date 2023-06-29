import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({})
export class SocketModule {
  providers: [SocketGateway];
}
