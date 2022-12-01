import PrivateModule from '../../ship/module/PrivateModule';
import GetUsersPrivateRoute from './routes/GetUsersPrivateRoute';
import containerBuilder from './containerBuilder';
import GetUserPrivateRoute from './routes/GetUserPrivateRoute';
import GetRolesListPrivateRoute from './routes/GetRolesListPrivateRoute';
import UpdateUserPrivateRoute from './routes/UpdateUserPrivateRoute';
import DeleteUserPrivateRoute from './routes/DeleteUserPrivateRoute';

export default new PrivateModule({
  moduleName: 'users',
  routes: [
    GetUsersPrivateRoute,
    GetUserPrivateRoute,
    GetRolesListPrivateRoute,
    UpdateUserPrivateRoute,
    DeleteUserPrivateRoute
  ],
  containerBuilder
});
