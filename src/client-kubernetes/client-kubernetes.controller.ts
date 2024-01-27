import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import {
  ClientKubernetesService,
  OutputPod,
  OutputPodDetail,
} from './client-kubernetes.service';
import { Request } from 'express';
import { PodsGuard } from './guards/pods.guard';
import { KubernetesGuard } from './guards/kubernetes.guard';

type UserFromKubeGuard = {
  id: string;
  email: string;
  role: string;
  kubeconfig: {
    name: string;
    user: {
      token: string;
    };
  };
};

@Controller('client-kubernetes')
export class ClientKubernetesController {
  constructor(private readonly clientKubernetes: ClientKubernetesService) {}

  @UseGuards(KubernetesGuard)
  @UseGuards(PodsGuard)
  @Get('/test123')
  registerUser(@Req() req: Request) {
    const { kubeconfig } = req.user as UserFromKubeGuard;
    return this.clientKubernetes.getPods(kubeconfig);
  }

  @UseGuards(KubernetesGuard, PodsGuard)
  @Get('/pods')
  getPods(@Req() req: Request): Promise<OutputPod[]> {
    const { kubeconfig } = req.user as UserFromKubeGuard;
    return this.clientKubernetes.getPods(kubeconfig);
  }

  @UseGuards(KubernetesGuard, PodsGuard)
  @Get('/pods/:id')
  getPod(
    @Req() req: Request,
    @Param('id') podName: string,
    @Query('namespace') namespace: string,
    @Query('type') type: string,
  ): Promise<OutputPodDetail | string> {
    const { kubeconfig } = req.user as UserFromKubeGuard;
    return this.clientKubernetes.getPod(kubeconfig, podName, namespace, type);
  }

  @UseGuards(KubernetesGuard, PodsGuard)
  @Get('/pods/:id/logs')
  getPodLogs(
    @Req() req: Request,
    @Param('id') podName: string,
    @Query('namespace') namespace: string,
  ): Promise<{ container: string; logs: string }[]> {
    const { kubeconfig } = req.user as UserFromKubeGuard;
    return this.clientKubernetes.getPodLogs(kubeconfig, podName, namespace);
  }
}
