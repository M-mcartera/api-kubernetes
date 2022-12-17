export default class UpdateUserPrivateController {
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
      const { username } = req.params;
      const {
        success,
        user,
        msg = ''
      } = await this.usersService.updateUser(username, req.body);

      const transformedUser = this.transformer.transform(user);

      return res
        .status(success ? 200 : 500)
        .send(success ? { data: transformedUser } : { msg });
    } catch (e) {
      return next(e);
    }
  }
}
