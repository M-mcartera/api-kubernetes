import Keycloak from 'keycloak-connect';
import session from 'express-session';

export default class KeycloakProvider {
    constructor({ serverSettings }) {
        const store = new session.MemoryStore();
        this.keycloak = new Keycloak(
            {
                store
            },
            {
                'client-id': serverSettings.keycloak_clientId,
                'server-url': serverSettings.keycloak_url,
                realm: serverSettings.keycloak_realm,
                secret: 'secret#123'
            }
        );
        this.keycloak.accessDenied = (req, res) => {
            return res.status(401).send({ error: true, msg: 'Unauthorized' });
        };
    }

    getKeycloakInstance() {
        return this.keycloak;
    }
}
