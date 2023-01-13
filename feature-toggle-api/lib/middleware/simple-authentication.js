'use strict';

const User = require('../user');
const axios = require('axios');
const AuthenticationRequired = require('../authentication-required');

const getAuthToken = req => {
    const headers = req.headers;

    if (
        !headers.authorization ||
        !/[Bb]earer (.*)/.test(headers.authorization)
    ) {
        return;
    }
    return /[Bb]earer (.*)/.exec(headers.authorization)[1];
};

const checkIfValidUserToken = req => {
    const env = req.headers.env || '';
    const nonProdEndpoint =
        'https://2rjjw9etmj.execute-api.us-east-1.amazonaws.com/non-prod/user-api/v1/user';
    const prodEndpoint =
        'https://pj03o0c2jk.execute-api.us-east-1.amazonaws.com/prod/user-api/v1/user';
    const isProd =
        env.toUpperCase() === 'PROD' || env.toUpperCase() === 'PRODUCTION';
    let userTokenValidationAPI;
    if (isProd) {
        userTokenValidationAPI = prodEndpoint;
    } else {
        userTokenValidationAPI = nonProdEndpoint;
    }
    console.log('UserTokenValidationAPI being called:', userTokenValidationAPI);
    const authTokenFromHeader = getAuthToken(req);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokenFromHeader}`,
        },
    };
    return axios.get(userTokenValidationAPI, config);
};

function unsecureAuthentication(basePath = '', app) {
    app.use(`${basePath}/api/admin/`, async (req, res, next) => {
        try {
            const user = await checkIfValidUserToken(req);
        } catch (e) {
            return res
                .status('401')
                .json(
                    new AuthenticationRequired({
                        path: `${basePath}/api/admin`,
                        type: 'unsecure',
                        message:
                            'Hard Refresh and relogin to refresh your token',
                    })
                )
                .end();
        }
        next();
    });
}

module.exports = unsecureAuthentication;
