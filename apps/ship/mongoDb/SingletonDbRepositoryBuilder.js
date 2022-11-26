import { asClass } from 'awilix';

/**
 *
 * @type {DbRepository} DbRepositoryClass
 * @return {dbRepositoryBuilder}
 */
export default DbRepositoryClass =>
    (collectionName = '') => {
        return asClass(DbRepositoryClass)
            .singleton()
            .inject(() => ({
                collectionName,
            }));
    };
