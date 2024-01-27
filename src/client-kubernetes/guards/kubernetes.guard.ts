import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

@Injectable()
export class KubernetesGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userKubeConfig = await this.userService.generateKubeConfig(
      request.user.id,
    );
    const payload = { ...request.user, kubeconfig: userKubeConfig };
    request['user'] = payload;
    return true;
  }
}
