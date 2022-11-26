import { MongoClient } from 'mongodb';

export default class MongoDbManager {
    constructor({ dbConfig, logger }) {
        this.dbConfig = dbConfig;
        this.logger = logger;

        this.connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: dbConfig.connectionPoolSize || 5,
        };
    }

    /**
     *
     * @return {Promise<{dbConn: Mongo.Db, dbClient: Mongo.MongoClient}>}
     */
    async connect() {
        try {
            const mongoClient = new MongoClient(
                this.dbConfig.connectionUri,
                this.connectionOptions,
            );

            await mongoClient.connect();

            const db = mongoClient.db(this.dbConfig.dbName);

            mongoClient.on('close', () => {
                this.logger.info('MongoDB connection was closed');
            });

            this.logger.info('MongoDB connected successfully');

            return {
                dbConn: db,
                dbClient: mongoClient,
            };
        } catch (e) {
            this.logger.error(
                `MongoDB connection has failed: ${e.message}`,
                e.message,
            );

            throw new Error(`MongoDB connection error: ${e.message}`);
        }
    }

    async close() {
        /* */
    }
}
