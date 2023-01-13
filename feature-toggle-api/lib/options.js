'use strict';

const { getFromVault } = require('@aerupit/aerup-lambda-commons');
const { defaultLogProvider, validateLogProvider } = require('./logger');

const isDev = () => process.env.NODE_ENV === 'development';
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const getDBConfig = async () => {
    const vaultCredentials = {
        url: process.env.VAULT_URL,
        apiVersion: process.env.VAULT_API_VERSION,
        role: process.env.VAULT_AWS_AUTH_ROLE,
    };
    const vaultPath = process.env.VAULT_PATH;
    const [featureToggleRds] = await getFromVault(
        vaultCredentials,
        `${vaultPath}/aerup-feature-toggle-rds`
    );
    return featureToggleRds;
};

async function defaultOptions() {
    const dbConfig = await getDBConfig();
    return {
        // postgres://feature-toggle-test:123456789@localhost:5432/featurestoggling
        // databaseUrl: 'postgres://localhost:5432/aerup-feature-toggle',
        databaseUrl: `${dbConfig.url}?ssl=true`,
        databaseSchema: 'public',
        port: process.env.HTTP_PORT || process.env.PORT || 4242,
        host: process.env.HTTP_HOST,
        pipe: undefined,
        baseUriPath: process.env.BASE_URI_PATH || '',
        serverMetrics: true,
        enableLegacyRoutes: true,
        extendedPermissions: false,
        enableRequestLogger: isDev(),
        sessionAge: THIRTY_DAYS,
        adminAuthentication: 'unsecure',
        secret: 'toggleuser',
        ui: {},
        importFile: undefined,
        dropBeforeImport: false,
        getLogger: defaultLogProvider,
        ssl: {
            ca: dbConfig.cert,
        },
    };
}

module.exports = {
    createOptions: async opts => {
        const options = Object.assign({}, await defaultOptions(), opts);

        if (!options.databaseUrl) {
            throw new Error(
                'You must either pass databaseUrl option or set environemnt variable DATABASE_URL || (DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME)'
            );
        }

        options.listen = options.pipe
            ? { path: options.pipe }
            : { port: options.port, host: options.host };
        validateLogProvider(options.getLogger);

        return options;
    },
};
