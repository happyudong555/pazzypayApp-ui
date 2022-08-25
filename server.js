const admin = require("firebase-admin");
const functions = require("firebase-functions");
const next = require("next");
const config = require("./next.config");
const express = require('express');
const helmet = require("helmet");
const compression = require('compression');
const minify = require('express-minify');
const cors = require('cors');
admin.initializeApp();
const appServer = express();
appServer.use(helmet())
appServer.use(compression());
appServer.use(minify());
appServer.use(cors({
  origin: '*'
}));
appServer.use(helmet.contentSecurityPolicy())
appServer.use(helmet.dnsPrefetchControl())
appServer.use(helmet.expectCt())
appServer.use(helmet.frameguard())
appServer.use(helmet.hidePoweredBy())
appServer.use(helmet.hsts())
appServer.use(helmet.ieNoOpen())
appServer.use(helmet.noSniff())
appServer.use(helmet.permittedCrossDomainPolicies())
appServer.use(helmet.referrerPolicy())
appServer.use(helmet.xssFilter())
const dev = process.env.NODE_ENV !== "production";
/*
const app = next({
  dev,
  // the absolute directory from the package.json file that initialises this module
  // IE: the absolute path from the root of the Cloud Function
  conf: config,
});
*/
const app = next({ dir: '.' , dev: false, staticMarkup: false, quiet: false, conf: null, chunk:null, cache: true});
const handle = app.getRequestHandler();
const server = functions.https.onRequest((request, response) => {
  return app.prepare().then(() => handle(request, response));
});

exports.nextjs = { server };


