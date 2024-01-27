import { Test, TestingModule } from '@nestjs/testing';
import { ClientKubernetesController } from './client-kubernetes.controller';

describe('ClientKubernetesController', () => {
  let controller: ClientKubernetesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientKubernetesController],
    }).compile();

    controller = module.get<ClientKubernetesController>(
      ClientKubernetesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
