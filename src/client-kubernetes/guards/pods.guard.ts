import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ClientKubernetesService } from '../client-kubernetes.service';

@Injectable()
export class PodsGuard implements CanActivate {
  constructor(private clientKubernetesService: ClientKubernetesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const response = await this.clientKubernetesService.dryRunPods(
      user.kubeconfig,
    );
    return response;
  }
}
