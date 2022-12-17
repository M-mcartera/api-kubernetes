import PrivateRoute from '../../../ship/routes/PrivateRoute';
import permissions from '../permissions';

export default new PrivateRoute({
  url: '/users',
  method: 'post',
  controller: 'CreateUserPrivateController',
  permission: permissions.MANAGE_USERS
});
