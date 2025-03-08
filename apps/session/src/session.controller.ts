import { Controller } from '@nestjs/common';
import { SessionService } from './session.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSessionDto } from './dto/create-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';

@Controller()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @MessagePattern('session.create')
  async createSession(@Payload() message: CreateSessionDto) {
    return this.sessionService.createSession(
      message.userId,
      message.expiration,
      {
        clientUUID: message.clientUUID,
        ipAddress: message.ipAddress,
        userAgent: message.userAgent,
      },
    );
  }

  @MessagePattern('session.close')
  closeSession(@Payload() message: CloseSessionDto) {
    return this.sessionService.closeSession(message.sessionUUID);
  }
}
