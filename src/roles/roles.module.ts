import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema, Role } from 'src/models/role.schema';
import { LoggerService } from 'src/logger/logger.service';
import { KubernetesModule } from 'src/kubernetes/kubernetes.module';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';
import { UserConfig, UserConfigSchema } from 'src/models/userConfig.schema';
import { UsersModule } from 'src/users/users.module';
import { UserService } from 'src/users/user.service';
import { Invite, InviteSchema } from 'src/models/invite.schema';
import { UserSchema, User } from 'src/models/user.schema';
import { HashService } from 'src/users/hash.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: UserConfig.name,
        schema: UserConfigSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Invite.name,
        schema: InviteSchema,
      },
    ]),
    KubernetesModule,
    UsersModule,
  ],
  providers: [
    RolesService,
    LoggerService,
    KubernetesService,
    UserService,
    HashService,
    MailService,
  ],
  controllers: [RolesController],
})
export class RolesModule {}
