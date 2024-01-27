import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { KubernetesModule } from './kubernetes/kubernetes.module';
import { LoggerService } from './logger/logger.service';
import { RolesModule } from './roles/roles.module';
import { ClientKubernetesModule } from './client-kubernetes/client-kubernetes.module';
import { TestMiddleware } from './middlewares/test.middleware';
import { ClientKubernetesController } from './client-kubernetes/client-kubernetes.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'kubernetes',
    }),
    UsersModule,
    AuthModule,
    MailModule,
    KubernetesModule,
    RolesModule,
    ClientKubernetesModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TestMiddleware).forRoutes(ClientKubernetesController);
  }
}
