import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './session/session.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
