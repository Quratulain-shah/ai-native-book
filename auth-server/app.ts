import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";

const app = new Hono();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://gemini-auth-server-demo.netlify.app",
  "https://devabdullah90.github.io",
  "https://quratulain-shah.github.io",
  "https://ai-native-book.vercel.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => c.text("Auth Server is running!"));

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

export default app;
