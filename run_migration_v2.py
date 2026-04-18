import glob

# Find the actual init migration (not index.ts)
files = [f for f in sorted(glob.glob('/var/www/payload-admin/migrations/*.ts')) if 'index' not in f]
if not files:
    print('No migration files found')
    exit(1)

latest = files[-1]
print(f'Using: {latest}')

with open(latest) as f:
    content = f.read()

marker = 'await db.execute(sql`'
start = content.find(marker) + len(marker)
end = content.find('`)', start)
sql = content[start:end].strip()
print(f'SQL length: {len(sql)}')

runner = f"""const {{ Pool }} = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pool = new Pool({{
  host: 'db.ogrvhooygcoazracbvkb.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Me=millionare1111', ssl: {{ rejectUnauthorized: false }}
}});
const sql = {repr(sql)};
pool.query(sql)
  .then(() => {{ console.log('MIGRATION_OK'); process.exit(0); }})
  .catch(e => {{ console.log('SQL_ERROR:', e.message.slice(0,300)); process.exit(1); }});
"""

with open('/var/www/payload-admin/run_m2.js', 'w') as f:
    f.write(runner)
print('Runner written')
