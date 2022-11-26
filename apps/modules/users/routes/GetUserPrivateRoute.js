import PrivateRoute from '../../../ship/routes/PrivateRoute';
import permissions from '../permissions';

export default new PrivateRoute({
    url: '/users/:username',
    method: 'get',
    controller: 'GetUserPrivateController',
    permission: permissions.READ_USERS
});
