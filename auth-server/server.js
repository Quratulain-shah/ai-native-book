"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_server_1 = require("@hono/node-server");
var app_js_1 = require("./app.js");
console.log("Setting up database schema if needed...");
console.log("Auth server running on http://localhost:4000");
(0, node_server_1.serve)({
    fetch: app_js_1.default.fetch,
    port: 4000,
});
