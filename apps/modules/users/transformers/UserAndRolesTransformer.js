import RestTransformer from '../../../ship/transformers/RestTransformer';

export default class UserAndRolesTransformer extends RestTransformer {
  constructor() {
    super();
  }

  transform(model) {
    const {
      email = '',
      firstName = '',
      lastName = '',
      username = '',
      createdTimestamp = '',
      emailVerified = ''
    } = model;

    const { roles = [] } = model;
    const transformedRoles = roles.map(role => {
      const { name } = role;
      return name;
    });

    return {
      email,
      firstName,
      lastName,
      username,
      createdTimestamp,
      emailVerified,
      roles: transformedRoles
    };
  }
}
