import { serve } from "@hono/node-server";
import { auth } from "./auth.js"; // Import auth to trigger database setup
import app from "./app.js";

console.log("Setting up database schema if needed...");
console.log("Auth server running on http://localhost:4000");

serve({
  fetch: app.fetch,
  port: 4000,
});