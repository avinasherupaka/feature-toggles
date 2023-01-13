'use strict';

require('db-migrate-shared').log.setLogLevel('error');

const { getInstance } = require('db-migrate');
const parseDbUrl = require('parse-database-url');

// eslint-disable-next-line no-unused-vars
function migrateDb({ databaseUrl, ssl, databaseSchema = 'public' }) {
    const custom = parseDbUrl(databaseUrl);
    custom.schema = databaseSchema;
    // Comment SSL out when in dev mode
    custom.ssl = true;
    const dbmigrate = getInstance(true, {
        cwd: __dirname,
        config: { custom },
        env: 'custom',
    });
    return dbmigrate.up();
}

module.exports = migrateDb;
