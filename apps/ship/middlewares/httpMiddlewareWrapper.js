import isString from 'lodash/isString';

/**
 * @typedef {string} middlewareName
 */

/**
 * @typedef {Object} MiddlewareParamsConfig
 */

/**
 * @typedef {Object} MiddlewareWithConfig
 * @property {middlewareName} name
 * @property {MiddlewareParamsConfig} params
 */

/**
 * @typedef {middlewareName|MiddlewareWithConfig} MiddlewareConfig
 */

/**
 * @param {AwilixContainer} container
 * @param {MiddlewareConfig} options
 */

export default (container, options) => async (req, res, next) => {
    const containerScope = req.container || container;

    if (!req.container) {
        req.container = container;
    }
    const middlewareName = isString(options) ? options : options.name;
    const middlewareConfig = isString(options) ? {} : options.params || {};

    const middleware = containerScope.resolve(middlewareName);

    return middleware.handle(req, res, next, middlewareConfig);
};
