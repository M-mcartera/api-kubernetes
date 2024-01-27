import { Module } from '@nestjs/common';
import { ClientKubernetesService } from './client-kubernetes.service';
import { ClientKubernetesController } from './client-kubernetes.controller';
import { UserService } from 'src/users/user.service';
import { UserSchema, User } from 'src/models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Invite, InviteSchema } from 'src/models/invite.schema';
import { Role, RoleSchema } from 'src/models/role.schema';
import { UserConfig, UserConfigSchema } from 'src/models/userConfig.schema';
import { HashService } from 'src/users/hash.service';
import { MailService } from 'src/mail/mail.service';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';
import { LoggerService } from 'src/logger/logger.service';
import { APP_GUARD } from '@nestjs/core';
import { KubernetesGuard } from './guards/kubernetes.guard';

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
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
  providers: [
    ClientKubernetesService,
    UserService,
    HashService,
    MailService,
    KubernetesService,
    LoggerService,
  ],
  controllers: [ClientKubernetesController],
})
export class ClientKubernetesModule {}
