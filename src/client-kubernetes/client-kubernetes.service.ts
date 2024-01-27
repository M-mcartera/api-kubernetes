import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';

type Token = {
  token: string;
};
type UserKubeConfig = {
  name: string;
  user: Token;
};

export type OutputPod = {
  name: string;
  namespace: string;
  creationTimestamp: Date;
  restartPolicy: string;
  status: string;
  node: string;
  images: string[];
};

type Condition = {
  lastProbeTime: Date;
  lastTransitionTime: Date;
  status: string;
  type: string;
};

type Mount = {
  name: string;
  readOnly: boolean;
  mountPath: string;
  subPath?: string;
};

type Container = {
  image: string;
  status: {
    ready: boolean;
    started: boolean;
    startedAt: Date;
  };
  mounts: Mount[];
};

export type OutputPodDetail = {
  metadata: {
    name: string;
    namespace: string;
    created: Date;
    uid: string;
    annotations: { [key: string]: string };
  };
  resource: {
    node: string;
    status: string;
    ip: string;
    qosClass: string;
    restarts: number;
    serviceAccounts: string;
  };
  conditions: Condition[];
  containers: Container[];
};

@Injectable()
export class ClientKubernetesService {
  private coreApi: CoreV1Api;
  private kubeConfig: KubeConfig;
  constructor() {
    this.kubeConfig = new KubeConfig();
    this.kubeConfig.loadFromDefault();
  }

  configureKubeConfig(userKubeConfig: UserKubeConfig) {
    const existingUserInContext = this.kubeConfig.getUser(userKubeConfig.name);
    if (!existingUserInContext) {
      this.kubeConfig.addUser({
        name: userKubeConfig.name,
        token: userKubeConfig.user.token,
      });
    }
    const existsingContext = this.kubeConfig.getContexts();
    if (
      _.isEmpty(
        existsingContext.find(
          (ctx) => ctx.name === `${userKubeConfig.name}-context`,
        ),
      )
    ) {
      this.kubeConfig.addContext({
        cluster: 'minikube',
        user: userKubeConfig.name,
        name: `${userKubeConfig.name}-context`,
        namespace: 'default',
      });
    }

    this.kubeConfig.setCurrentContext(`${userKubeConfig.name}-context`);
  }

  async getPods(userKubeConfig: UserKubeConfig): Promise<OutputPod[]> {
    try {
      this.configureKubeConfig(userKubeConfig);
      this.coreApi = this.kubeConfig.makeApiClient(CoreV1Api);
      const namespaces = await this.coreApi.listNamespace();
      const defaultNs = [
        'kube-node-lease',
        'kube-public',
        'kube-system',
        'kubernetes-dashboard',
      ];
      const pods = await Promise.all(
        namespaces.body.items.map((ns) => {
          if (defaultNs.includes(ns.metadata.name)) {
            return null;
          }
          return this.coreApi.listNamespacedPod(ns.metadata.name);
        }),
      );
      const transformedPods: OutputPod[] = pods
        .filter((el) => el)
        .map((podResponse) => {
          const { items } = podResponse.body;
          if (_.isEmpty(items)) {
            return null;
          }
          return items.map((item) => {
            return {
              name: item.metadata.name,
              namespace: item.metadata.namespace,
              creationTimestamp: item.metadata.creationTimestamp,
              restartPolicy: item.spec.restartPolicy,
              status: item.status.phase,
              node: item.spec.nodeName,
              images: item.spec.containers.map((c) => c.image),
            };
          });
        })
        .filter((el) => el)
        .flat();
      return transformedPods.flat();
    } catch (err) {
      console.log('error');
      console.log(err);
      return err;
    }
  }
  async dryRunPods(kubeConfig: UserKubeConfig): Promise<boolean> {
    try {
      this.configureKubeConfig(kubeConfig);
      this.coreApi = this.kubeConfig.makeApiClient(CoreV1Api);
      await this.coreApi.listNamespacedPod('default');
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getPod(
    kubeConfig: UserKubeConfig,
    podName: string,
    namespace: string,
    type: string,
  ): Promise<OutputPodDetail | string> {
    try {
      this.configureKubeConfig(kubeConfig);
      this.coreApi = this.kubeConfig.makeApiClient(CoreV1Api);
      const { body: pod } = await this.coreApi.readNamespacedPod(
        podName,
        namespace,
      );
      if (type === 'edit') {
        return JSON.stringify(pod, null, 2);
      }
      console.log(type);
      return {
        metadata: {
          name: pod.metadata.name,
          namespace: pod.metadata.namespace,
          created: pod.metadata.creationTimestamp,
          annotations: pod.metadata.annotations,
          uid: pod.metadata.uid,
        },
        resource: {
          node: pod.spec.nodeName,
          status: pod.status.phase,
          ip: pod.status.podIP,
          qosClass: pod.status.qosClass,
          restarts: pod.status.containerStatuses.reduce(
            (prev, next) => prev + next.restartCount,
            0,
          ),
          serviceAccounts: pod.spec.serviceAccountName,
        },
        conditions: pod.status.conditions.map((cond) => {
          return {
            lastProbeTime: cond.lastProbeTime,
            lastTransitionTime: cond.lastTransitionTime,
            status: cond.status,
            type: cond.type,
          };
        }),
        containers: pod.spec.containers.map((container) => {
          const containerStatus = pod.status.containerStatuses.find(
            (cs) => cs.name === container.name,
          );

          return {
            image: container.image,
            status: {
              ready: containerStatus.ready,
              started: containerStatus.started,
              startedAt:
                containerStatus?.lastState?.running?.startedAt || new Date(),
            },
            mounts: container.volumeMounts.map((mount) => ({
              name: mount.name,
              readOnly: mount.readOnly,
              mountPath: mount.mountPath,
              subPath: mount.subPath,
            })),
          };
        }),
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getPodLogs(
    kubeConfig: UserKubeConfig,
    podName: string,
    namespace: string,
  ): Promise<{ container: string; logs: string }[]> {
    try {
      this.configureKubeConfig(kubeConfig);
      this.coreApi = this.kubeConfig.makeApiClient(CoreV1Api);
      const podContainers = await this.coreApi
        .readNamespacedPod(podName, namespace)
        .then((response) => {
          return response.body.spec.containers.map(
            (container) => container.name,
          );
        })
        .catch(() => {
          return [];
        });
      const response = await Promise.all(
        podContainers?.map(async (container) => {
          const logs = await this.coreApi.readNamespacedPodLog(
            podName,
            namespace,
            container,
          );

          return { container, logs: logs.body || '' };
        }),
      ).then((res) => res);
      return response;
    } catch (err) {
      console.log({ err: err.body });
      throw err;
    }
  }
}
