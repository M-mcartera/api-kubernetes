export default class KeycloakMiddleware {
    /**
     *
     * @param {KeycloakProvider} keycloakProvider
     */
    constructor({ keycloakProvider }) {
        this.keycloakProvider = keycloakProvider;
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @param {AppPermission} permission
     */
    handle(req, res, next, { permission }) {
        const keycloak = this.keycloakProvider.getKeycloakInstance();

        const middlewares = [
            ...keycloak.middleware(),
            keycloak.protect(this._checkPermission.bind(this, permission))
        ];

        const handleMiddleware = middlewareIndex => {
            try {
                if (middlewareIndex >= middlewares.length) {
                    return next();
                }

                const nextFunc = () => {
                    // handle the next middleware in the chain
                    return handleMiddleware(middlewareIndex + 1);
                };

                // process the middleware
                const middleware = middlewares[middlewareIndex];
                return middleware(req, res, nextFunc);
            } catch (err) {
                return res
                    .status(401)
                    .send({ error: true, msg: 'Unauthorized' });
            }
        };

        return handleMiddleware(0);
    }

    /**
     *
     * @param {AppPermission} permission
     * @param token
     * @return {boolean}
     * @private
     */
    _checkPermission(permission, token) {
        return (
            token.hasRole(permission.getWildcardPermissionName()) ||
            token.hasRole(permission.getPermissionName())
        );
    }
}
