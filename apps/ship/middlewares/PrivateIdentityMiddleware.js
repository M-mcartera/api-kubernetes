import { asValue } from 'awilix';

/**
 * @typedef {Object} UserIdentity
 * @property {string|null} id
 * @property {'customer'|'staff'} type
 * @property {string} name
 * @property {string} email
 */

export default class PrivateIdentityMiddleware {
    handle(req, _res, next, _extraParams) {
        /**
         *
         * @type {UserIdentity}
         */
        const userIdentity = {
            id: null,
            type: 'staff',
            name: 'System',
            email: ''
        };

        if (req.kauth) {
            userIdentity.id = req.kauth.grant.access_token.content.sub;
            userIdentity.name = req.kauth.grant.access_token.content.name;
            userIdentity.email = req.kauth.grant.access_token.content.email;
        }

        req.container.register({
            userIdentity: asValue(userIdentity)
        });

        return next();
    }
}
