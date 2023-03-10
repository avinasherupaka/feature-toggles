'use strict';

// export module version
require('pkginfo')(module, 'version');
const version = module.exports.version;
const clientApiDef = require('./client-api/api-def.json');
const adminApiDef = require('./admin-api/api-def.json');

const apiDef = {
    name: 'aerup-feature-toggle-api',
    version,
    uri: '/api',
    links: {
        admin: {
            uri: '/api/admin',
            links: adminApiDef.links,
        },
        client: {
            uri: '/api/client',
            links: clientApiDef.links,
        },
    },
};

module.exports = apiDef;
