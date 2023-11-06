import { Module } from '@nestjs/common';
import { KubernetesService } from './kubernetes.service';
import { KubernetesController } from './kubernetes.controller';
import { LoggerService } from 'src/logger/logger.service';
import { UserService } from 'src/users/user.service';
import { User, UserSchema } from 'src/models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Invite, InviteSchema } from 'src/models/invite.schema';
import { HashService } from 'src/users/hash.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { UserConfig, UserConfigSchema } from 'src/models/userConfig.schema';
import { RoleSchema, Role } from 'src/models/role.schema';

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
    MailModule,
  ],
  providers: [
    KubernetesService,
    LoggerService,
    UserService,
    HashService,
    MailService,
  ],
  controllers: [KubernetesController],
})
export class KubernetesModule {}
