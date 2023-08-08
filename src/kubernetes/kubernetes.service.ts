import {
  CoreV1Api,
  KubeConfig,
  RbacAuthorizationV1Api,
} from '@kubernetes/client-node';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import * as fs from 'fs';
import { exec } from 'child_process';
import { UserConfig, UserConfigDocument } from 'src/models/userConfig.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PERMISSION_RESOURCE } from 'src/global/interfaces';
import { of } from 'rxjs';
@Injectable()
export class KubernetesService {
  private coreApi: CoreV1Api;
  private roleApi: RbacAuthorizationV1Api;
  constructor(
    @InjectModel(UserConfig.name)
    private readonly userConfig: Model<UserConfigDocument>,
    private readonly loggerService: LoggerService,
  ) {
    const kubeConfig = new KubeConfig();
    kubeConfig.loadFromDefault();
    this.coreApi = kubeConfig.makeApiClient(CoreV1Api);
    this.roleApi = kubeConfig.makeApiClient(RbacAuthorizationV1Api);
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
          return {
            name: item.metadata.name,
            status: item.status.phase,
            creationTimeStamp: item.metadata.creationTimestamp,
          };
        })
        .filter((el) => !systemNamespaces.includes(el.name));

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
      const namespaceDoc = {
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
          name: namespace,
          labels: {
            name: namespace,
          },
        },
      };
      const response = await this.coreApi.createNamespace(namespaceDoc);
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

  async validateNamespace(namespace: string) {
    try {
      const response = await this.coreApi.readNamespace(namespace);
      if (response) {
        return { success: false };
      }
    } catch (err) {
      if (err.body.reason === 'NotFound') {
        return { success: true };
      }
      this.loggerService.error('Error validating namespace', err.message);
      throw new BadRequestException(err.message);
    }
  }

  execAsync(command): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async createServiceAccount(
    userId: string,
    name: string,
    namespace = 'default',
  ) {
    try {
      const sa = {
        metadata: {
          name: name,
        },
      };

      await this.coreApi.createNamespacedServiceAccount(namespace, sa);

      await this.coreApi.createNamespacedSecret(namespace, {
        metadata: {
          name: name,
          annotations: {
            'kubernetes.io/service-account.name': name,
          },
        },
        type: 'kubernetes.io/service-account-token',
      });

      const { stdout, stderr } = await this.execAsync(
        `kubectl describe secret ${name} | grep token: `,
      );

      const saToken = stdout.replace('token: ', '').trim();

      const modelPayload = {
        userId,
        config: await this.generateKubeConfig(name, saToken),
      };

      const userConfig = await this.userConfig.create(modelPayload);
      userConfig.save();
    } catch (err) {
      console.log('create service account error', err);
    }
  }

  readCaCert() {
    const caCertFilePath = '/Users/carteramihail/.minikube/ca.crt';
    const caCert = fs.readFileSync(caCertFilePath, 'utf8');
    return caCert;
  }

  async generateKubeConfig(name: string, token: string) {
    try {
      const kubeConfig = {
        apiVersion: 'v1',
        kind: 'Config',
        clusters: [
          {
            name: 'minikube',
            cluster: {
              server: 'https://127.0.0.1:49825',
              'certificate-authority-data': this.readCaCert(),
              'insecure-skip-tls-verify': true,
            },
          },
        ],
        users: [
          {
            name: name,
            user: {
              token: token,
            },
          },
        ],
        contexts: [
          {
            name: 'minikube',
            context: {
              cluster: 'minikube',
              user: name,
            },
          },
        ],
        'current-context': 'minikube',
      };
      return kubeConfig;
    } catch (err) {
      console.log('Error generating kubeconfig', err.body);
    }
  }
  generateClusterRoleRules(resources: PERMISSION_RESOURCE[]) {
    const rules = [];

    resources.forEach((resource) => {
      const tempDto = {
        apiGroups: [''],
        resources: [],
        verbs: [],
      };
      tempDto.resources.push(resource.name.toLowerCase());
      const wildcard = resource.actions.find((action) => action.name === 'all');
      if (wildcard.checked) {
        tempDto.verbs.push('*');
      } else {
        resource.actions.forEach((action) => {
          if (action.checked) {
            tempDto.verbs.push(action.name.toLowerCase());
          }
        });
      }
      rules.push(tempDto);
    });

    return rules.filter((rule) => rule.verbs.length > 0);
  }

  async createClusterRole(roleName: string, resources: PERMISSION_RESOURCE[]) {
    const rules = this.generateClusterRoleRules(resources);
    try {
      const clusterRole = {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'ClusterRole',
        metadata: {
          name: roleName,
        },
        rules,
      };
      return this.roleApi.createClusterRole(clusterRole);
    } catch (err) {
      this.loggerService.error('Error creating cluster role', err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteClusterRole(roleName: string) {
    try {
      return this.roleApi.deleteClusterRole(roleName);
    } catch (err) {
      this.loggerService.error('Error deleting cluster role', err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateClusterRole(roleName: string, resources: PERMISSION_RESOURCE[]) {
    const rules = this.generateClusterRoleRules(resources);
    try {
      const clusterRole = {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'ClusterRole',
        metadata: {
          name: roleName,
        },
        rules,
      };
      return this.roleApi.replaceClusterRole(roleName, clusterRole);
    } catch (err) {
      this.loggerService.error('Error updating cluster role', err.message);
      throw new InternalServerErrorException(err.message);
    }
  }
}
