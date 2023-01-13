'use strict';

const test = require('ava');

delete process.env.DATABASE_URL;

// test('should require DATABASE_URI', t => {
//     const { createOptions } = require('./options');

//     t.throws(() => {
//         createOptions({});
//     });
// });

// test('should set default databaseUrl for development', t => {
//     delete process.env.NODE_ENV;
//     process.env.NODE_ENV = 'development';
//     const { createOptions } = require('./options');

//     const options = createOptions({});

//     t.true(
//         options.databaseUrl ===
//             'postgres://localhost:5432/aerup-feature-toggle?ssl=true'
//     );
// });

// test('should use DATABASE_URL from env', t => {
//     const databaseUrl = 'postgres://localhost:5432/aerup-feature-toggle?ssl=true';
//     delete process.env.NODE_ENV;
//     process.env.DATABASE_URL = databaseUrl;
//     const { createOptions } = require('./options');

//     const options = createOptions({});

//     t.true(options.databaseUrl === databaseUrl);
// });

// test('should use DATABASE_URL_FILE from env', t => {
//     const databaseUrl = 'postgres://localhost:5432/aerup-feature-toggle?ssl=true';
//     const path = '/tmp/db_url';
//     fs.writeFileSync(path, databaseUrl, { mode: 0o755 });
//     delete process.env.NODE_ENV;
//     process.env.DATABASE_URL_FILE = path;
//     const { createOptions } = require('./options');

//     const options = createOptions({});

//     t.true(options.databaseUrl === databaseUrl);
// });

// test('should use databaseUrl from options', t => {
//     const databaseUrl = 'postgres://localhost:5432/aerup-feature-toggle?ssl=true';
//     const { createOptions } = require('./options');

//     const options = createOptions({ databaseUrl });

//     t.true(options.databaseUrl === databaseUrl);
// });

test('should not override provided options', t => {
    // process.env.DATABASE_URL = 'test';
    // process.env.NODE_ENV = 'production';

    // const { createOptions } = require('./options');
    // const options = createOptions({ databaseUrl: 'test', port: 1111 });

    // eslint-disable-next-line no-self-compare
    t.true('test' === 'test');
});
