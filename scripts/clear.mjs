#!/usr/bin/env node
/**
 * Clear script: buida la taula `tickets` de Supabase.
 * Útil per tornar a fer el seed des de zero.
 *
 * Ús:
 *   node scripts/clear.mjs
 */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

function loadEnv() {
  const env = {}
  const raw = readFileSync(join(ROOT, '.env.local'), 'utf8')
  for (const line of raw.split('\n')) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
  return env
}

const env = loadEnv()
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Falten NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY a .env.local')
  process.exit(1)
}

console.log('🗑️  Buidant la taula tickets...')
const res = await fetch(`${SUPABASE_URL}/rest/v1/tickets?id=neq.00000000-0000-0000-0000-000000000000`, {
  method: 'DELETE',
  headers: {
    'apikey':        SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer':        'return=minimal',
  },
})

if (!res.ok) {
  const text = await res.text()
  console.error(`❌ Error: ${res.status} ${text}`)
  process.exit(1)
}

console.log('✅ Taula buidada!\n')
