import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isFinite from 'lodash/isFinite';
import isNaN from 'lodash/isNaN';
import { ObjectID } from 'mongodb';

class ParseService {
    getString(value) {
        return (value || '').toString();
    }

    getDateIfValid(value) {
        const date = Date.parse(value);
        return isNaN(date) ? null : new Date(date);
    }

    getArrayIfValid(value) {
        return isArray(value) ? value : null;
    }

    getObjectIDIfValid(value) {
        return ObjectID.isValid(value) ? new ObjectID(value) : null;
    }

    getArrayOfObjectID(value) {
        if (isArray(value) && !isEmpty(value)) {
            return value
                .map(id => this.getObjectIDIfValid(id))
                .filter(id => !!id);
        }
        return [];
    }

    isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
    }

    getNumberIfValid(value) {
        return this.isNumber(value) ? parseFloat(value) : null;
    }

    getIntegerNumberIfValid(value) {
        return this.isNumber(value) ? parseInt(value) : null;
    }

    getNumberIfPositive(value) {
        const n = this.getNumberIfValid(value);
        return n && n >= 0 ? n : null;
    }
    getBooleanIfValid(value, defaultValue = null) {
        if (typeof value === 'string') {
            if (
                value.toLowerCase() === 'true' ||
                value.toLowerCase() === 'false'
            ) {
                return value.toLowerCase() === 'true';
            }
        }
        return typeof value === 'boolean' ? value : defaultValue;
    }
}

export default new ParseService();
