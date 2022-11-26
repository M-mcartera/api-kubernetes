import { asClass, InjectionMode, createContainer, asValue } from 'awilix';

import App from './app';
import MongoDbRepository from './ship/mongoDb/MongoDbRepository';
import SingletonDbRepositoryBuilder from './ship/mongoDb/SingletonDbRepositoryBuilder';
import ServerSettings from './ship/ServerSettings/serverSettings';
import MongoDbManager from './ship/mongoDb/MongoDbManager';
import KeycloakProvider from './ship/keycloak/KeycloakProvider';
import { logger } from './ship/logger';
import KeycloakMiddleware from './ship/middlewares/KeycloakMiddleware';
import PrivateIdentityMiddleware from './ship/middlewares/PrivateIdentityMiddleware';

const serverSettings = new ServerSettings();
export default class Bootstrap {
    constructor() {
        this.instance = null;
    }

    async init() {
        this.instance = await this._createContainer();
        return true;
    }
    run(callback) {
        const app = this.instance.resolve('app');
        app.start(this.instance, callback);
    }

    async _createContainer() {
        const container = createContainer({
            injectionMode: InjectionMode.PROXY
        });

        const DbRepositoryClass = MongoDbRepository;

        const DbRepositoryBuilder =
            SingletonDbRepositoryBuilder(DbRepositoryClass);

        container.register({
            dbConfig: asValue({
                connectionUri: serverSettings.mongodbServerUrl,
                dbName: serverSettings.mongodbConnectionInfo?.database || '',
                connectionPoolSize: serverSettings.dbConnectionPoolSize
            }),
            mongoDbManager: asClass(MongoDbManager).scoped(),
            DbRepositoryBuilder: asValue(DbRepositoryBuilder),
            logger: asValue(logger),
            app: asClass(App).singleton(),
            serverSettings: asValue(serverSettings),
            keycloakAdminConfig: asValue({
                url: serverSettings.keycloak_url,
                realm: serverSettings.keycloak_admin_realm,
                username: serverSettings.keycloak_admin_username,
                password: serverSettings.keycloak_admin_password,
                clientId: serverSettings.keycloak_admin_client_id,
                grantType: serverSettings.keycloak_grantType
            }),
            keycloakProvider: asClass(KeycloakProvider).scoped(),
            keycloakMiddleware: asClass(KeycloakMiddleware).scoped(),
            privateIdentityMiddleware: asClass(
                PrivateIdentityMiddleware
            ).singleton()
        });

        const mongoDbInstance = container.resolve('mongoDbManager');
        try {
            await mongoDbInstance.connect();
        } catch (err) {
            console.log(err);
        }
        return container;
    }
}
