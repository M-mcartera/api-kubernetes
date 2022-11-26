import isEmpty from 'lodash/isEmpty';
import { ObjectId } from 'mongodb';
import { logger } from '../logger';
import { DEFAULT_PAGE_SIZE, INFINITE_PAGE_SIZE } from './constants';

export default class MongoDbRepository {
    /**
     *
     * @param {Db} dbConn
     * @param {string} collectionName
     */
    constructor({ dbConn, collectionName }) {
        this.collection = dbConn.collection(collectionName);
        this.collectionName = collectionName;
    }

    getCollectionName() {
        return this.collectionName;
    }

    async count(filter = {}) {
        return this.collection.countDocuments(filter);
    }

    async countAll() {
        return this.collection.estimatedDocumentCount();
    }

    async findOne(filter = {}, projection = {}) {
        const options = {};
        if (!isEmpty(projection)) {
            options.projection = projection;
        }

        return this.collection.findOne(
            {
                ...filter,
            },
            options,
        );
    }

    async findById(id) {
        if (!ObjectId.isValid(id)) {
            logger.debug(
                `Invalid identifier "${id}" provided for "findById" method on "${this.collectionName}" repository`,
            );
            return false;
        }

        return this.collection.findOne({
            _id: new ObjectId(id),
        });
    }

    async findMany(
        filter = {},
        sort = {},
        projection = {},
        pagination = { offset: 0, size: DEFAULT_PAGE_SIZE },
    ) {
        const options = {};
        if (!isEmpty(projection)) {
            options.projection = projection;
        }

        let dbCursor = this.collection.find(
            {
                ...filter,
            },
            options,
        );

        if (!isEmpty(sort)) {
            dbCursor = dbCursor.sort({ ...sort });
        }

        dbCursor = dbCursor.skip(pagination.offset || 0);

        if (pagination.size !== INFINITE_PAGE_SIZE) {
            dbCursor = dbCursor.limit(pagination.size);
        }

        return dbCursor.toArray();
    }

    async findManyByAggregation(
        aggregationFilters = [],
        pagination = { offset: 0, size: DEFAULT_PAGE_SIZE },
    ) {
        let dbCursor = this.collection
            .aggregate(aggregationFilters)
            .skip(pagination.offset);

        if (pagination.size !== INFINITE_PAGE_SIZE) {
            dbCursor = dbCursor.limit(pagination.size);
        }

        return dbCursor.toArray();
    }

    async create(model = {}) {
        const insertResult = await this.collection.insertOne(model);

        if (insertResult.insertedCount === 1 && insertResult.insertedId) {
            return {
                _id: insertResult.insertedId,
                ...model,
            };
        }

        return null;
    }

    async createMany(models = []) {
        return this.collection.insertMany(models);
    }

    async update(id, model = {}, action = '$set') {
        if (!ObjectId.isValid(id)) {
            logger.debug(
                `Invalid identifier "${id}" provided for "update" method on "${this.collectionName}" repository`,
            );
            return false;
        }

        const updateResult = await this.collection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                [action]: { ...model },
            },
        );

        return updateResult.matchedCount === 1;
    }

    async updateOne(filter = {}, updateData = {}, action = '$set') {
        const updateResult = await this.collection.updateOne(filter, {
            [action]: { ...updateData },
        });

        return !!updateResult.result.ok;
    }

    async updateMany(filter = {}, updateData = {}, action = '$set') {
        const updateManyResult = await this.collection.updateMany(filter, {
            [action]: { ...updateData },
        });

        return !!updateManyResult.result.ok;
    }

    async remove(id) {
        if (!ObjectId.isValid(id)) {
            logger.debug(
                `Invalid identifier "${id}" provided for "remove" method on "${this.collectionName}" repository`,
            );
            return false;
        }

        const deleteResult = await this.collection.deleteOne({
            _id: new ObjectId(id),
        });

        return !!deleteResult.result.ok;
    }

    async removeOne(filter = {}) {
        if (isEmpty(filter)) {
            return false;
        }

        const delResult = await this.collection.deleteOne(filter);

        return !!delResult.deletedCount;
    }

    async removeMany(filter = {}) {
        const deleteResult = await this.collection.deleteMany(filter);

        return !!deleteResult.result.ok;
    }
}
