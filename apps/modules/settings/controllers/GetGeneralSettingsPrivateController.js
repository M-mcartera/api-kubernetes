export default class GetGeneralSettingsPrivateController {
    constructor() {}

    async handle(req, res, next) {
        try {
            return res.send({ data: '' });
        } catch (err) {
            return next();
        }
    }
}
