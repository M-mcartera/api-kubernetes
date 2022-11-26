import KeycloakAdmin from '@keycloak/keycloak-admin-client';
import { logger } from '../../../ship/logger';
/**
 * @typedef {import('@keycloak/keycloak-admin-client').KeycloakAdminClient} KcAdminClient
 */

/**
 * @typedef {import('@keycloak/keycloak-admin-client').GrantTypes} GrantTypes
 */

/**
 * @typedef {Object} KeycloakAdminConfig
 * @property {string} url
 * @property {string} clientId
 * @property {string} realm
 * @property {string} username
 * @property {string} password
 * @property {GrantTypes} grantType
 */

export default class KeycloakAdminClient {
    /**
     * @type {KcAdminClient}
     */
    admin;

    logged = false;

    /**
     *
     * @param {KeycloakAdminConfig} keycloakAdminConfig
     * @param {serverSettings} serverSettings
     */
    constructor({ keycloakAdminConfig, serverSettings }) {
        this.keycloakAdminConfig = keycloakAdminConfig;
        this.serverSettings = serverSettings;

        this.admin = new KeycloakAdmin({
            baseUrl: keycloakAdminConfig.url,
            realmName: keycloakAdminConfig.realm
        });
    }

    filterKeycloakRoles(list) {
        const defaultRoles = [
            'uma_authorization',
            'offline_access',
            'default-roles-control-panel'
        ];
        return list.filter(role => !defaultRoles.includes(role.name));
    }

    async authenticateAdmin() {
        try {
            this.admin.setConfig({
                realmName: this.keycloakAdminConfig.realm
            });
            await this.admin.auth({
                username: this.keycloakAdminConfig.username,
                password: this.keycloakAdminConfig.password,
                clientId: this.keycloakAdminConfig.clientId,
                grantType: this.keycloakAdminConfig.grantType
            });
            if (!this.logged) {
                this.logged = true;
                logger.debug('### KEYCLOAK ADMIN AUTHENTCATED ###');
            }
            return true;
        } catch (err) {
            logger.error('### KEYCLOAK ADMIN ERROR ###', err);
            throw Error(err);
        }
    }

    async findUsersAndRoles() {
        try {
            this.admin.setConfig({
                realmName: this.serverSettings.keycloak_realm
            });
            const users = await this.admin.users.find();
            const allPromises = users.map(async user => {
                return this.admin.users
                    .listRealmRoleMappings({ id: user.id })
                    .then(roles => {
                        user.roles = this.filterKeycloakRoles(roles);
                        return user;
                    });
            });
            return Promise.all(allPromises).then(result => {
                return result.filter(res => res.username !== 'admin_cli');
            });
        } catch (err) {
            logger.error('### KEYCLOAK FIND USERS AND ROLES ###', err);
            throw Error(err);
        }
    }

    async findUser(username) {
        try {
            this.admin.setConfig({
                realmName: this.serverSettings.keycloak_realm
            });

            const [user] = await this.admin.users.findOne({
                username: username
            });
            const roles = await this.admin.users.listRealmRoleMappings({
                id: user.id
            });

            return { ...user, roles: this.filterKeycloakRoles(roles) };
        } catch (err) {
            throw Error(err);
        }
    }

    async findRoles() {
        try {
            this.admin.setConfig({
                realmName: this.serverSettings.keycloak_realm
            });

            const roles = await this.admin.roles.find();
            const usefulRoles = this.filterKeycloakRoles(roles);

            return usefulRoles;
        } catch (err) {
            throw Error(err);
        }
    }
}
