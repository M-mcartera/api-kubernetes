import PrivateRoute from '../../../ship/routes/PrivateRoute';
import permissions from '../permissions';

export default new PrivateRoute({
    url: '/users',
    method: 'get',
    permission: permissions.READ_USERS,
    controller: 'GetUsersPrivateController'
});
