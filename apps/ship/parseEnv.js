import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import envSettings from '../configs/env.json';
import parse from '../utils/ParseService';
import { logger } from './logger';

const converters = {
    string: value => parse.getString(value),
    boolean: value => parse.getBooleanIfValid(value),
    number: value => parse.getNumberIfValid(value),
};

const developerMode = converters.boolean(envSettings.DEVELOPER_MODE) || false;

export default (envKey, valueType = 'string', required = !developerMode) => {
    const envValue = envSettings[envKey];

    if (required && (isNull(envValue) || isUndefined(envValue))) {
        logger.error(`[BOOT] Missing value for env variable "${envKey}"`);
        throw new Error(`Missing environment variable ${envKey}`);
    }

    const valueConverter = converters[valueType] || converters.string;

    const value = valueConverter(envValue);

    if (required && isNull(value)) {
        logger.error(
            `[BOOT] Invalid value for env variable "${envKey}" : "${value}"`,
        );
        throw new Error(
            `Invalid value for environment variable ${envKey} : "${value}"`,
        );
    }

    return value;
};
