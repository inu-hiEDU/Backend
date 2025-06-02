import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

// WebSocketGateway 설정
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


// 프론트엔드에서 환경변수로 WebSocket 서버 주소를 사용하려면 아래와 같이 작성해야 합니다.
// (이 코드는 프론트엔드에서 사용해야 하며, 백엔드에서는 필요하지 않습니다)
/*
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_WS_URL, {
  query: { userId: '학생ID' },
});
*/