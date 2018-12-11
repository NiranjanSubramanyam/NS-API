const http = require('http');
const https = require('https');
const app = require('./app');
const fs = require('fs');

const privateKey  = fs.readFileSync('sslcert/irrowgroup.com.key', 'utf8');
const certificate = fs.readFileSync('sslcert/irrowgroup.com.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};

//const port = process.env.port || 3000;

const server = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

server.listen(3000);
httpsServer.listen(443);