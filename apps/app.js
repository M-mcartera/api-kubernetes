import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { asValue } from 'awilix';
import SettingsModule from './modules/settings/index';
import UsersModule from './modules/users/index';

export default class App {
    constructor({ serverSettings }) {
        this.serverSettings = serverSettings;
    }

    start(container, callback) {
        const app = this._create(container);
        const port = this.serverSettings.api_port;

        app.listen(port, callback(port));
    }

    _create(container) {
        const app = express();
        const router = express.Router();
        app.use(compression());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(cors());

        app.use('/api', router);

        container.register({
            router: asValue(router),
        });

        SettingsModule.setupModule(container);
        UsersModule.setupModule(container);

        return app;
    }
}
