import RestTransformer from '../../../ship/transformers/RestTransformer';

export default class RoleTransformer extends RestTransformer {
    constructor() {
        super();
    }

    transform(model) {
        const { name = '' } = model;

        return { name };
    }
}
