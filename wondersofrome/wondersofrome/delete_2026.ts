const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const email = 'superadmin@romeagency.com';
const password = 'SuperAdmin2025!';

async function run() {
    const authRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const { token } = await authRes.json();

    const dateStart = '2026-01-01T00:00:00.000Z';
    const dateEnd = '2026-12-31T23:59:59.999Z';

    console.log('Cleaning up 2026 slots...');
    let total = 0;
    while(true) {
        const res = await fetch(`${PAYLOAD_URL}/api/inventory?where[tenant][equals]=wondersofrome&where[date][greater_than_equal]=${encodeURIComponent(dateStart)}&where[date][less_than_equal]=${encodeURIComponent(dateEnd)}&limit=50&depth=0`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
            console.log('Server busy, waiting 2s...');
            await new Promise(r => setTimeout(r, 2000));
            continue;
        }
        const data = await res.json();
        if (data.docs.length === 0) break;

        for (const d of data.docs) {
            await fetch(`${PAYLOAD_URL}/api/inventory/${d.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            total++;
        }
        console.log(`Deleted ${total}...`);
    }
}
run();
