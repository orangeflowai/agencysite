import sys

with open('/var/www/payload-admin/migrations/20260416_142610_init.ts') as f:
    content = f.read()

marker = 'await db.execute(sql`'
start = content.find(marker) + len(marker)
end = content.find('`)', start)
sql = content[start:end].strip()

print(f'SQL length: {len(sql)}', file=sys.stderr)

runner = f"""const {{ Pool }} = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pool = new Pool({{
  host: 'db.ogrvhooygcoazracbvkb.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Me=millionare1111', ssl: {{ rejectUnauthorized: false }}
}});
const sqlStr = {repr(sql)};
pool.query(sqlStr)
  .then(() => {{ console.log('MIGRATION_OK'); process.exit(0); }})
  .catch(e => {{ console.log('SQL_ERROR:', e.message.slice(0,400)); process.exit(1); }});
"""

with open('/var/www/payload-admin/run_migration.js', 'w') as f:
    f.write(runner)

print('Runner written successfully')
