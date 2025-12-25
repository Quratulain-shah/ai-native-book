"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
var better_auth_1 = require("better-auth");
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
// Load environment variables from the root .env file and backend .env as fallback
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), "../.env") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), "../backend/.env") });
if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is not set in environment variables. Connection may fail.");
}
else {
    console.log("Database Driver: Using PostgreSQL with connection string starting with: " + process.env.DATABASE_URL.substring(0, 15) + "...");
}
exports.auth = (0, better_auth_1.betterAuth)({
    database: new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["http://localhost:3000", "https://gemini-auth-server-demo.netlify.app", "https://devabdullah90.github.io"],
    advanced: {
        cookiePrefix: "better-auth",
        crossSubDomainCookies: {
            enabled: true,
            domain: "netlify.app"
        },
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            httpOnly: true
        }
    }
});
