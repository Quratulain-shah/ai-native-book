"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hono_1 = require("hono");
var cors_1 = require("hono/cors");
var auth_js_1 = require("./auth.js");
var app = new hono_1.Hono();
app.use("*", (0, cors_1.cors)({
    origin: ["http://localhost:3000", "https://your-docusaurus-site.netlify.app", "https://gemini-auth-server-demo.netlify.app", "https://devabdullah90.github.io"], // Add your production frontend URL here
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
}));
app.get("/", function (c) { return c.text("Auth Server is running!"); });
app.on(["POST", "GET"], "/api/auth/*", function (c) {
    return auth_js_1.auth.handler(c.req.raw);
});
exports.default = app;
