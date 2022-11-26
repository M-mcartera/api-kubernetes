import * as ACTIONS from '../../ship/permissions/actions';
import AppPermission from '../../ship/permissions/AppPermission';
import { Users, Roles } from './entities';

export default {
    READ_USERS: new AppPermission(Users, ACTIONS.READ),
    MANAGE_USERS: new AppPermission(Users, ACTIONS.MANAGE),
    READ_ROLES: new AppPermission(Roles, ACTIONS.READ),
    MANAGE_ROLES: new AppPermission(Roles, ACTIONS.MANAGE)
};
