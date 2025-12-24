import { betterAuth } from "better-auth";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from the root .env file and backend .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "../backend/.env") });

if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is not set in environment variables. Connection may fail.");
} else {
    console.log("Database Driver: Using PostgreSQL with connection string starting with: " + process.env.DATABASE_URL.substring(0, 15) + "...");
}

export const auth = betterAuth({
    database: new Pool({
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
            enabled: false  // Disable for local development
        },
        defaultCookieAttributes: {
            sameSite: "lax",  // Changed for local development
            secure: false,    // Changed for local development
            httpOnly: true
        }
    }
});