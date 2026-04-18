import glob

files = [f for f in sorted(glob.glob('/var/www/payload-admin/migrations/*.ts')) if 'index' not in f]
latest = files[-1]
print(f'Migration: {latest}')

with open(latest) as f:
    content = f.read()

marker = 'await db.execute(sql`'
start = content.find(marker) + len(marker)
end = content.find('`)', start)
full_sql = content[start:end].strip()

# Extract ONLY tours and tours_guest_types statements
statements = [s.strip() for s in full_sql.split(';') if s.strip()]
tours_stmts = [s for s in statements if (
    'tours' in s.lower() and
    'payload_locked' not in s.lower() and
    'payload_preferences' not in s.lower() and
    'payload_migrations' not in s.lower() and
    'payload_kv' not in s.lower() and
    'users' not in s.lower() and
    'media' not in s.lower() and
    'site_settings' not in s.lower() and
    'bookings' not in s.lower()
)]
tours_sql = ';\n'.join(tours_stmts) + ';'
print(f'Tours SQL: {len(tours_sql)} chars, {len(tours_stmts)} statements')
for s in tours_stmts:
    print(' -', s[:80])

runner = f"""const {{ Pool }} = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pool = new Pool({{
  host: 'db.ogrvhooygcoazracbvkb.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'Me=millionare1111', ssl: {{ rejectUnauthorized: false }}
}});
const sql = {repr(tours_sql)};
pool.query(sql)
  .then(() => {{ console.log('TOURS_MIGRATION_OK'); process.exit(0); }})
  .catch(e => {{ console.log('ERR:', e.message.slice(0,300)); process.exit(1); }});
"""

with open('/var/www/payload-admin/run_tours_only.js', 'w') as f:
    f.write(runner)
print('Runner written')
