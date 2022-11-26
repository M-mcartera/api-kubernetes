export default class GetUserPrivateController {
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
            const { success, user } = await this.usersService.getUser(username);

            return res
                .status(success ? 200 : 500)
                .send({ data: this.transformer.transform(user) });
        } catch (e) {
            return next(e);
        }
    }
}
