import Bootstrap from './apps/bootstrap';
import { logger } from './apps/ship/logger';

const bootstrap = new Bootstrap();
bootstrap.init().then(() => {
    bootstrap.run(port =>
        logger.info(`Server started and running on port: ${port}`),
    );
});
