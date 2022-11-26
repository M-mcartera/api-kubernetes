import { Lifetime } from 'awilix';
import { logger } from '../logger';
import httpMiddlewareWrapper from '../middlewares/httpMiddlewareWrapper';

export default class PrivateModule {
    constructor({ moduleName, routes, containerBuilder }) {
        this.moduleName = moduleName;
        this.routes = routes;
        this.containerBuilder = containerBuilder;
    }
    setupModule(container) {
        const router = container.resolve('router');
        container.loadModules(
            [
                `apps/modules/${this.moduleName}/controllers/*.js`,
                `apps/modules/${this.moduleName}/services/*.js`,
                `apps/modules/${this.moduleName}/transformers/*.js`
            ],
            {
                resolverOptions: {
                    lifetime: Lifetime.SCOPED // db and repositories will be singleton
                }
            }
        );

        container.register(
            this.containerBuilder({
                DbRepositoryBuilder: container.resolve('DbRepositoryBuilder'),
                serverSettings: container.resolve('serverSettings')
            })
        );

        this.routes.forEach(route => {
            const middlewares = [
                {
                    name: 'keycloakMiddleware',
                    params: { permission: route.permission }
                },
                'privateIdentityMiddleware'
            ];
            const allMiddlewares = [...middlewares, ...route.extraMiddlewares];
            router[route.method](
                route.url,
                ...allMiddlewares.map(middlewareOptions =>
                    httpMiddlewareWrapper(container, middlewareOptions)
                ),

                async (req, res, next) => {
                    // get the controller instance from the container
                    const controllerInstance = container.resolve(
                        route.controller
                    );
                    return controllerInstance.handle.call(
                        controllerInstance,
                        req,
                        res,
                        next
                    );
                }
            );
        });

        logger.info(
            `[MODULE REGISTRATION] Successfully registered module ${this.moduleName}`
        );
    }
}
