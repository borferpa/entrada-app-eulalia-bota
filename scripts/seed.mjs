#!/usr/bin/env node
/**
 * Seed script: migra els JSONs de /data a la taula `tickets` de Supabase.
 *
 * Ús:
 *   node scripts/seed.mjs
 *
 * Requisits:
 *   - Node 18+ (fetch natiu)
 *   - .env.local amb NEXT_PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY
 *
 * Executar primer scripts/clear.mjs si vols buidar la taula abans.
 */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// --- Càrrega de variables d'entorn des de .env.local ---
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

// --- Parsers (mateixa lògica que lib/services/tickets.ts) ---
function parseEuros(value) {
  return parseFloat(value.replace(/[€\s]/g, '').replace(',', '.')) || 0
}

function parseDate(value) {
  const [day, month, year] = value.split('-')
  return `${year}-${month}-${day}`
}

function parseConcepte(value) {
  return value.replace(/^.*TIQUET\s+/i, '').trim()
}

// --- Fonts de dades i categoria ---
const SOURCES = [
  { file: 'entradas.json',        categoria: 'entrada' },
  { file: 'bebida-refresco.json', categoria: 'refresc' },
  { file: 'bebida-agua.json',     categoria: 'aigua'   },
  { file: 'helados.json',         categoria: 'gelat'   },
]

function buildRows() {
  const rows = []
  for (const { file, categoria } of SOURCES) {
    const data = JSON.parse(readFileSync(join(ROOT, 'data', file), 'utf8'))
    for (const row of data) {
      rows.push({
        ref_moviment:   row[0],
        titular:        row[1],
        concepte:       parseConcepte(row[2]),
        categoria,
        tipus:          row[3],
        data_emissio:   parseDate(row[4]),
        data_venciment: parseDate(row[5]),
        forma_pagament: row[6],
        import:         parseEuros(row[7]),
        pendent:        parseEuros(row[8]),
        estat:          row[9],
        entregada:      false,
        filtra:         parseDate(row[4]).substring(0, 4),
      })
    }
    console.log(`  ✓ ${file}: ${data.length} files llegides`)
  }
  return rows
}

// --- Insert per lots ---
async function insertBatch(rows, batchSize = 200) {
  const url = `${SUPABASE_URL}/rest/v1/tickets`
  const headers = {
    'Content-Type':  'application/json',
    'apikey':        SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer':        'return=minimal',
  }

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(batch),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Error al lot ${Math.floor(i / batchSize) + 1}: ${res.status} ${text}`)
    }
    process.stdout.write(`\r  → Inserits ${Math.min(i + batchSize, rows.length)} / ${rows.length}`)
  }
  console.log()
}

// --- Main ---
console.log('\n📂 Llegint fitxers JSON...')
const rows = buildRows()
console.log(`\n📊 Total files a inserir: ${rows.length}`)
console.log('⬆️  Inserint a Supabase...\n')
await insertBatch(rows)
console.log('\n✅ Seed completat!\n')
