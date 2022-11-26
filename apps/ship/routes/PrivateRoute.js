import ServerError from '../errors/ServerError';

export default class PrivateRoute {
    constructor({ url, method, controller, permission, middlewares = [] }) {
        if (!permission) {
            throw new ServerError(
                `Missing permission for PrivateRoute ${method.toUpperCase()}:${url}, with controller ${controller}`
            );
        }
        this.url = url;
        this.method = method;
        this.controller = controller;
        this.permission = permission;
        this.extraMiddlewares = middlewares;
    }
    registerRoute(router, container) {}
}
