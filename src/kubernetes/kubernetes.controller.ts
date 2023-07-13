import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ROLES } from 'src/constants/constants';
import { Public, Roles } from 'src/decorators/custom.decorators';
import { KubernetesService } from './kubernetes.service';

@Controller('kubernetes')
export class KubernetesController {
  constructor(private readonly kubeService: KubernetesService) {}
  @Public()
  @Get()
  getPods() {
    return this.kubeService.getPods();
  }

  @Roles(ROLES.ADMIN)
  @Get('/namespaces')
  getNamespaces() {
    return this.kubeService.getNamespaces();
  }

  @Roles(ROLES.ADMIN)
  @Delete('/namespaces/:namespace')
  deleteNamespace(namespace: string) {
    return this.kubeService.deleteNamespace(namespace);
  }

  @Roles(ROLES.ADMIN)
  @Get('/namespaces/:namespace')
  getNamespace(namespace: string) {
    return this.kubeService.getNamespace(namespace);
  }

  @Roles(ROLES.ADMIN)
  @Post('/namespaces')
  createNamespace(namespace: string) {
    return this.kubeService.createNamespace(namespace);
  }
}
