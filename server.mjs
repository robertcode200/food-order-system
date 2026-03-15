import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SEED_PATH = join(__dirname, 'db.seed.json')
const DB_PATH = join(__dirname, 'db.json')
const PORT = 3001

copyFileSync(SEED_PATH, DB_PATH)

function readDb() {
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
}

function writeDb(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

function send(res, status, data) {
  const body = data !== undefined ? JSON.stringify(data) : ''
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(body)
}

const server = createServer(async (req, res) => {
  const pathname = (req.url ?? '/').split('?')[0]
  const { method } = req

  if (method === 'OPTIONS') {
    send(res, 204)
    return
  }

  if (method === 'GET' && pathname === '/categories') {
    send(res, 200, readDb().categories)
    return
  }

  if (method === 'GET' && pathname === '/foods') {
    send(res, 200, readDb().foods)
    return
  }

  if (method === 'GET' && pathname === '/orders') {
    send(res, 200, readDb().orders)
    return
  }

  if (method === 'POST' && pathname === '/orders') {
    try {
      const body = await parseBody(req)
      const items = Array.isArray(body.items) ? body.items : []
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      const order = {
        id: randomUUID(),
        items,
        total,
        submittedAt: new Date().toISOString(),
      }

      const data = readDb()
      data.orders.push(order)
      writeDb(data)

      send(res, 201, order)
    } catch {
      send(res, 500, { error: 'Internal server error' })
    }
    return
  }

  if (method === 'DELETE' && pathname === '/orders') {
    const data = readDb()
    data.orders = []
    writeDb(data)
    send(res, 204)
    return
  }

  send(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}`)
  console.log(`  GET  http://localhost:${PORT}/categories`)
  console.log(`  GET  http://localhost:${PORT}/foods`)
  console.log(`  GET  http://localhost:${PORT}/orders`)
  console.log(`  POST http://localhost:${PORT}/orders`)
  console.log(`  DELETE http://localhost:${PORT}/orders`)
})
