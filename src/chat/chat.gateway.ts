import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private chatService: ChatService,
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  afterInit() {
    this.logger.log('Initialized');
  }
  async handleConnection(client: Socket) {
    this.logger.log(`${client.id} connected successfully`);
    const token = client.handshake.headers.auth.toString();
    const payload = this.authService.verifyAccessToken(token);
    const user = await this.userService.findById(payload.sub);
    if (user) {
      console.log(user);
    } else {
      client.disconnect(true);
      return;
    }
  }

  @SubscribeMessage('event')
  handleEvent(client: Socket) {
    console.log(client.id);
    throw new WsException('random Error');
  }

  handleDisconnect(client: Socket) {
    throw new Error('Method not implemented.');
  }
}
