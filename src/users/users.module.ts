import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { HashService } from 'src/users/hash.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { Invite, InviteSchema } from 'src/models/invite.schema';
import { MailService } from 'src/mail/mail.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { UserConfig, UserConfigSchema } from 'src/models/userConfig.schema';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';
import { LoggerService } from 'src/logger/logger.service';
import { KubernetesModule } from 'src/kubernetes/kubernetes.module';

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
      {
        name: UserConfig.name,
        schema: UserConfigSchema,
      },
    ]),
    KubernetesModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    HashService,
    JwtStrategy,
    LocalStrategy,
    AuthService,
    MailService,
    SocketGateway,
    LoggerService,
    KubernetesService,
  ],
})
export class UsersModule {}
