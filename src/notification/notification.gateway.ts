import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection {
  private clients = new Map<string, Socket>();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.clients.set(userId, client);
  }

  sendToUser(userId: string, payload: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit('notification', payload);
    }
  }
}
