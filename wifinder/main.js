/* global module */

var c = require('colors');
var cp = require('child_process');
var http = require('http');
var fs = require('fs');
var ini = require('ini');
var crypto = require('crypto');

/**
 * 
 * @returns {Main}
 */
var Main = function () {
  this.portHTTP = 0;
  this.dbConfig = {
    host: '',
    port: 0,
    authKey: '',
    db: ''
  };
};

/**
 * Faz a leitura do ficheiro de configuracao e carrega as variaveis para inicias o servidor HTTP
 * @returns {undefined}
 */
Main.prototype.start = function () {
  this.config = ini.parse(fs.readFileSync('./ConfigHTTP.ini', 'utf-8'));
  this.dbConfig = {
    host: this.config.database.host,
    port: this.config.database.port,
    authKey: crypto.createHash('sha1').update(this.config.database.projectname).digest('hex')
  };

  this.portHTTP = this.config.server_http.port;
  this.startHTTPServer();
};

/**
 * Inicia o servidor HTTP
 * @returns {undefined}
 */
Main.prototype.startHTTPServer = function () {
  var args = {
    port: this.portHTTP,
    configdb: this.dbConfig
  };

  var child = cp.fork('./lib/server');
  child.send(args);

  console.log("__          __ _  _____         _               _    _                       ".yellow);
  console.log("\\ \\        / /(_)|  __ \\       | |             | |  (_)                   ".yellow);
  console.log(" \\ \\  /\\  / /  _ | |  | |  ___ | |_  ___   ___ | |_  _   ___   _ __       ".yellow);
  console.log("  \\ \\/  \\/ /  | || |  | | / _ \\| __|/ _ \\ / __|| __|| | / _ \\ | '_ \\  ".yellow);
  console.log("   \\  /\\  /   | || |__| ||  __/| |_|  __/| (__ | |_ | || (_) || | | |      ".yellow);
  console.log("    \\/  \\/    |_||_____/  \\___| \\__|\\___| \\___| \\__||_| \\___/ |_| |_|".yellow);
  console.log("****************** Server HTTP Start ******************".yellow);
};

var serverHttp = new Main();
serverHttp.start();

module.exports = Main;
