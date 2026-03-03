import { serve } from "@hono/node-server";
import { auth } from "./auth.js"; // Import auth to trigger database setup
import app from "./app.js";

const port = parseInt(process.env.PORT || "7860", 10);

console.log("Setting up database schema if needed...");
console.log(`Auth server running on http://0.0.0.0:${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});