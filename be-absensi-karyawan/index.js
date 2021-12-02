"use strict";

const path = require("path");
global.express = require("express");
var bodyParser = require("body-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
var sql = require("mssql");
var encryptdata = require("./encryptdata.js");

var header = encryptdata;
header.user = Buffer.from(encryptdata.header.ena, "base64").toString();
header.password = Buffer.from(encryptdata.header.enb, "base64").toString();
header.server = Buffer.from(encryptdata.header.enc, "base64").toString();
header.connectionTimeout = 3000000;
header.requestTimeout = 3000000;
header.pool = {
  idleTimeoutMillis: 3000000,
  max: 1000,
};
// header.database = Buffer.from(encryptdata.header.end, 'base64').toString();

var connection = sql.connect(header, function (err) {
  if (err) throw err;
});
module.exports = connection;

require("dotenv").config();

// Setting Base directory
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization"
  );
  next();
});

app.disable("etag");

global.env = process.env.NODE_ENV;

require(path.join(__dirname, "/config/express"))(app);

server.listen(app.get("port"), () => {
  console.log(
    `\n App listening at http://localhost:${app.get("port")} in ${env} mode`
  );
});

module.exports.server = http.createServer(app);
