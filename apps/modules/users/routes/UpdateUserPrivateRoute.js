import PrivateRoute from '../../../ship/routes/PrivateRoute';
import permissions from '../permissions';

export default new PrivateRoute({
  url: '/users/:username',
  method: 'post',
  controller: 'UpdateUserPrivateController',
  permission: permissions.MANAGE_USERS
});
