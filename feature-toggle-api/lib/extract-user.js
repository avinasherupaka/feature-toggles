'use strict';

function extractUsername(req) {
    return req.session.user ? req.session.user.email : 'unknown';
}

module.exports = extractUsername;
