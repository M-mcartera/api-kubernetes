import PrivateModule from '../../ship/module/PrivateModule';
import GetUsersPrivateRoute from './routes/GetUsersPrivateRoute';
import containerBuilder from './containerBuilder';
import GetUserPrivateRoute from './routes/GetUserPrivateRoute';
import GetRolesListPrivateRoute from './routes/GetRolesListPrivateRoute';

export default new PrivateModule({
    moduleName: 'users',
    routes: [
        GetUsersPrivateRoute,
        GetUserPrivateRoute,
        GetRolesListPrivateRoute
    ],
    containerBuilder
});
