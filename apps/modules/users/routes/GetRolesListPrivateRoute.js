import PrivateRoute from '../../../ship/routes/PrivateRoute';
import permissions from '../permissions';

export default new PrivateRoute({
    url: '/roles',
    method: 'get',
    controller: 'GetRolesListPrivateController',
    permission: permissions.READ_ROLES
});
