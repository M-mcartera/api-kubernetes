import mongoUri from 'mongodb-uri';
import parseEnv from '../parseEnv';

export default class ServerSettings {
    constructor() {
        this.admin_url = parseEnv('ADMIN_URL');
        this.api_port = parseEnv('API_PORT');
        this.mongodbServerUrl = parseEnv('DB_CONNECTION_URI');
        this.mongodbConnectionInfo = mongoUri.parse(
            parseEnv('DB_CONNECTION_URI')
        );
        this.dbConnectionPoolSize = parseEnv(
            'DB_CONNECTION_POOL_SIZE',
            'number',
            false
        );
        this.keycloak_url = parseEnv('KEYCLOAK_URL');
        this.keycloak_realm = parseEnv('KEYCLOAK_REALM');
        this.keycloak_username = parseEnv('KEYCLOAK_USERNAME');
        this.keycloak_password = parseEnv('KEYCLOAK_PASSWORD');
        this.keycloak_realm = parseEnv('KEYCLOAK_REALM');
        this.keycloak_clientId = parseEnv('KEYCLOAK_CLIENT_ID');
        this.keycloak_grantType = parseEnv('KEYCLOAK_GRANT_TYPE');
        this.keycloak_admin_realm = parseEnv('KEYCLOAK_ADMIN_REALM');
        this.keycloak_admin_username = parseEnv('KEYCLOAK_ADMIN_USERNAME');
        this.keycloak_admin_password = parseEnv('KEYCLOAK_ADMIN_PASSWORD');
        this.keycloak_admin_client_id = parseEnv('KEYCLOAK_ADMIN_CLIENT_ID');
    }
}
