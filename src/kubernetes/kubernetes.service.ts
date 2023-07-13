import { CoreV1Api, KubeConfig, V1Namespace } from '@kubernetes/client-node';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class KubernetesService {
  private coreApi: CoreV1Api;
  constructor(private readonly loggerService: LoggerService) {
    const kubeConfig = new KubeConfig();
    kubeConfig.loadFromDefault();
    this.coreApi = kubeConfig.makeApiClient(CoreV1Api);
  }

  async getPods() {
    const { body } = await this.coreApi.listNamespacedService('default');
    return body.items.map((item) => item.metadata.name);
  }

  async getNamespaces() {
    try {
      const { body: namespacesResponse } = await this.coreApi.listNamespace();
      if (!namespacesResponse) {
        throw new BadRequestException('No namespaces found');
      }
      const systemNamespaces = [
        'kube-node-lease',
        'kube-public',
        'kube-system',
        'kubernetes-dashboard',
      ];

      const allNamespaces = namespacesResponse.items
        .map((item) => {
          return item.metadata.name;
        })
        .filter((el) => !systemNamespaces.includes(el));

      return allNamespaces;
    } catch (err) {
      this.loggerService.error('Error getting namespaces', err.message);
      throw new BadRequestException(err.message);
    }
  }

  async deleteNamespace(namespace: string) {
    try {
      const response = await this.coreApi.deleteNamespace(namespace);
      this.loggerService.log('Namespace deleted', namespace);
      return response;
    } catch (err) {
      this.loggerService.error('Error deleting namespace', err.message);
      throw new BadRequestException(err.message);
    }
  }

  async createNamespace(namespace: string) {
    try {
      const newNamespace: V1Namespace = {
        metadata: {
          name: namespace,
        },
      };
      const response = await this.coreApi.createNamespace(newNamespace);
      this.loggerService.log('Namespace created', namespace);
      return response;
    } catch (err) {
      this.loggerService.error('Error creating namespace', err.message);
      throw new BadRequestException(err.message);
    }
  }

  async getNamespace(namespace: string) {
    try {
      const response = await this.coreApi.readNamespace(namespace);
      this.loggerService.log('Namespace retrieved', namespace);
      return response;
    } catch (err) {
      this.loggerService.error('Error getting namespace', err.message);
      throw new BadRequestException(err.message);
    }
  }
}
