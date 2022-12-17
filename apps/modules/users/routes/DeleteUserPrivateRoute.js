import PrivateRoute from '../../../ship/routes/PrivateRoute';
import permissions from '../permissions';

export default new PrivateRoute({
  url: '/users/:username',
  method: 'delete',
  controller: 'DeleteUserPrivateController',
  permission: permissions.MANAGE_USERS
});
