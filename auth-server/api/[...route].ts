import { handle } from 'hono/vercel'
import { auth } from '../auth.js'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Re-create the Hono app instance for the Serverless Function env
const app = new Hono().basePath('/api/auth')

app.use(
    '*',
    cors({
        origin: (origin) => origin, // Allow all origins or configure specific
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true,
    })
)

// Mount the better-auth handler
app.all('/*', (c) => auth.handler(c.req.raw))

// Add a simple health check for the root of the auth path
app.get('/', (c) => c.json({ status: 'Auth Server is running!', version: '1.0.0' }))

export const GET = handle(app)
export const POST = handle(app)
