#!/bin/sh
set -eu

export INITIAL_MIGRATION=20260330100000_initial_schema

set +e
node --input-type=module <<'NODE'
import pg from 'pg'

const { Client } = pg
const client = new Client({ connectionString: process.env.DATABASE_URL })
let exitCode = 0

await client.connect()
try {
  const tables = await client.query(`
    SELECT
      to_regclass('public.users') IS NOT NULL AS has_users_table,
      to_regclass('public._prisma_migrations') IS NOT NULL AS has_migrations_table
  `)
  const row = tables.rows[0]

  if (row.has_users_table) {
    if (!row.has_migrations_table) {
      exitCode = 42
    } else {
      const migration = await client.query(
        'SELECT 1 FROM "_prisma_migrations" WHERE migration_name = $1 AND rolled_back_at IS NULL LIMIT 1',
        [process.env.INITIAL_MIGRATION],
      )
      if (migration.rowCount === 0) exitCode = 42
    }
  }
} finally {
  await client.end()
}

process.exit(exitCode)
NODE
status=$?
set -e

if [ "$status" -eq 42 ]; then
  echo "Baselining existing Bunker46 database for Prisma migrations"
  npx prisma migrate resolve \
    --schema=prisma/schema.prisma \
    --applied "$INITIAL_MIGRATION"
elif [ "$status" -ne 0 ]; then
  exit "$status"
fi

exec ./docker-entrypoint.sh
