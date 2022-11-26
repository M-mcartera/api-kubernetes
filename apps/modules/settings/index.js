import PrivateModule from '../../ship/module/PrivateModule';
import GetGeneralSettingsPrivateRoute from './routes/GetGeneralSettingsPrivateRoute';
import containerBuilder from './containerBuilder';

export default new PrivateModule({
    moduleName: 'settings',
    routes: [GetGeneralSettingsPrivateRoute],
    containerBuilder,
});
