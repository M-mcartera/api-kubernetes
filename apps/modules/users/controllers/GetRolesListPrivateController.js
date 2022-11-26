export default class GetRolesListPrivateController {
    /**
     *
     * @param {UsersService} UsersService
     * @param {RoleTransformer} RoleTransformer
     */
    constructor({ UsersService, RoleTransformer }) {
        this.usersService = UsersService;
        this.transformer = RoleTransformer;
    }

    async handle(req, res, next) {
        try {
            const { success, roles } = await this.usersService.listRoles();
            const transformedRoles = roles.map(role =>
                this.transformer.transform(role)
            );
            return res
                .status(success ? 200 : 500)
                .send({ data: transformedRoles });
        } catch (err) {
            return next(err);
        }
    }
}
