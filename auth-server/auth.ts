import { betterAuth } from "better-auth";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables - try local .env first, then fallback paths
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "../backend/.env") });

if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is not set in environment variables. Connection may fail.");
} else {
    console.log("Database Driver: Using PostgreSQL with connection string starting with: " + process.env.DATABASE_URL.substring(0, 15) + "...");
}

const isProduction = process.env.NODE_ENV === "production";

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
    trustedOrigins: [
        "http://localhost:3000",
        "https://gemini-auth-server-demo.netlify.app",
        "https://devabdullah90.github.io",
        "https://quratulain-shah.github.io",
        "https://ai-native-book.vercel.app",
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ],
    advanced: {
        cookiePrefix: "better-auth",
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            httpOnly: true,
        },
    },
});