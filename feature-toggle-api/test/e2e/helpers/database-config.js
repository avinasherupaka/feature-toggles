'use strict';

function getDatabaseUrl() {
    if (process.env.TEST_DATABASE_URL) {
        return process.env.TEST_DATABASE_URL;
    } else {
        return 'postgres://localhost:5432/aerup-feature-toggle';
    }
}

module.exports = {
    getDatabaseUrl,
};
