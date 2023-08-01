import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
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
  createNamespace(@Body() createNamespacePayload: { name: string }) {
    const { name } = createNamespacePayload;
    return this.kubeService.createNamespace(name);
  }

  @Roles(ROLES.ADMIN)
  @Get('/validateNamespace')
  validateNamespace(@Query('name') namespace: string) {
    return this.kubeService.validateNamespace(namespace);
  }
}
