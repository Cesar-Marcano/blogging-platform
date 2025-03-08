import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@app/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaService,
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
