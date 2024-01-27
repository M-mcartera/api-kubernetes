import { Test, TestingModule } from '@nestjs/testing';
import { KubernetesService } from './kubernetes.service';
import { LoggerService } from '..//logger/logger.service';
import { Model } from 'mongoose';
import { UserConfigDocument } from 'src/models/userConfig.schema';

jest.mock('@nestjs/mongoose');
jest.mock('@nestjs/common');
jest.mock('fs');

describe('KubernetesService', () => {
  let service: KubernetesService;
  let userConfigModel: Model<UserConfigDocument>;
  let loggerService: LoggerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KubernetesService,
        LoggerService,
        { provide: Model, useValue: userConfigModel },
      ],
    }).compile();

    service = module.get<KubernetesService>(KubernetesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return pods', async () => {
    const result = await service.getPods();
    expect(result).toBeInstanceOf(Array);
  });
});
