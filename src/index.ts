import { Hono } from 'hono'
import app from '../app/server'

const server = new Hono()

// Integrasikan semua rute dari app/server.ts
server.route('/', app)

// Wajib diekspor secara default untuk Cloudflare Pages Function
export default server
