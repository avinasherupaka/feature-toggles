'use strict';

const path = require('path');
const proxy = require('express-http-proxy');
const express = require('express');
const app = express();

const publicFolder = path.join(__dirname, 'dist');

app.use(express.static(publicFolder));
// app.use('/api', proxy('http://localhost:4242'));

app.use(
    proxy('https://api-aerup-feature-toggle.agro.services', {
        proxyReqPathResolver(req) {
            return `https://api-aerup-feature-toggle.agro.services${req.url}`;
        },
    })
);

app.get('/*', (req, res) => {
    res.sendFile(path.join(publicFolder, 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port ${port}`);
