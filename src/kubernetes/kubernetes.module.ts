import { Module } from '@nestjs/common';
import { KubernetesService } from './kubernetes.service';
import { KubernetesController } from './kubernetes.controller';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  providers: [KubernetesService, LoggerService],
  controllers: [KubernetesController],
})
export class KubernetesModule {}
