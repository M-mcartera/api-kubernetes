import isEmpty from 'lodash/isEmpty';

export default class CreateUserPrivateController {
  constructor({ UsersService, UserAndRolesTransformer }) {
    this.usersService = UsersService;
    this.transformer = UserAndRolesTransformer;
  }
  async handle(req, res, next) {
    try {
      const { username, email, password, roles } = req.body;
      if (
        isEmpty(username) ||
        isEmpty(email) ||
        isEmpty(password) ||
        isEmpty(roles)
      ) {
        return res
          .status(503)
          .send({ success: false, msg: 'Invalid payload parameters' });
      }
      const createdUser = await this.usersService.createUser(req.body);

      return res.status(createdUser.success ? 200 : 500).send({
        success: !!createdUser.success,
        user: createdUser.success
          ? this.transformer.transform(createdUser)
          : {},
        msg: createdUser.success ? '' : 'Failed to create an user'
      });
    } catch (err) {
      return next(err);
    }
  }
}
