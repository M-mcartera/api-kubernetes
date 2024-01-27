import { Test, TestingModule } from '@nestjs/testing';
import { ClientKubernetesService } from './client-kubernetes.service';

describe('ClientKubernetesService', () => {
  let service: ClientKubernetesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientKubernetesService],
    }).compile();

    service = module.get<ClientKubernetesService>(ClientKubernetesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
