'use strict';

const test = require('ava');
const { setupAppWithCustomAuth } = require('./../../helpers/test-helper');
const AuthenticationRequired = require('./../../../../lib/authentication-required');
// const User = require('./../../../../lib/user');

test.serial('should require authenticated user', async t => {
    t.plan(0);
    const preHook = app => {
        app.use('/api/admin/', (req, res) =>
            res
                .status('401')
                .json(
                    new AuthenticationRequired({
                        path: '/api/admin/login',
                        type: 'custom',
                        message: `You have to identify yourself.`,
                    })
                )
                .end()
        );
    };
    const { request, destroy } = await setupAppWithCustomAuth(
        'feature_api_custom_auth',
        preHook
    );
    return request
        .get('/api/admin/features')
        .expect(401)
        .then(destroy);
});
