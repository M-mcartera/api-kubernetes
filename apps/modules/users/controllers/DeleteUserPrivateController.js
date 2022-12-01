export default class DeleteUserPrivateController {
  /**
   *
   * @param {SettingsService} SettingsService
   */
  constructor({ UsersService }) {
    this.usersService = UsersService;
  }

  async handle(req, res, next) {
    try {
      const { username } = req.params;
      const { success, msg = '' } = await this.usersService.deleteUser(
        username
      );
      return res.status(success ? 200 : 500).send({ success, msg });
    } catch (e) {
      return next(e);
    }
  }
}
