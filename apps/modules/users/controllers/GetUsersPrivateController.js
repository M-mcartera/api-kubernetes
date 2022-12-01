export default class GetUsersPrivateController {
  /**
   *
   * @param {SettingsService} SettingsService
   * @param {UserAndRolesTransformer} UserAndRolesTransformer
   */
  constructor({ UsersService, UserAndRolesTransformer }) {
    this.usersService = UsersService;
    this.transformer = UserAndRolesTransformer;
  }

  async handle(req, res, next) {
    try {
      const { success, users } = await this.usersService.listUsers();
      const sanitizedUsers = users.map(user =>
        this.transformer.transform(user)
      );
      return res.status(success ? 200 : 500).send({ data: sanitizedUsers });
    } catch (e) {
      return next(e);
    }
  }
}
