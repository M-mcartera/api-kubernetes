import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { HashService } from 'src/users/hash.service';
import { LocalStrategy } from './strategies/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { UserRoleGuard } from './guards/roles.guard';
import { Invite, InviteSchema } from 'src/models/invite.schema';
import { MailService } from 'src/mail/mail.service';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Invite.name,
        schema: InviteSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: 'secret123',
      signOptions: {
        expiresIn: '60d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    HashService,
    MailService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserRoleGuard,
    },
  ],
})
export class AuthModule {}
