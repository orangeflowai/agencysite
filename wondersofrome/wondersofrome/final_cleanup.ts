const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const email = 'superadmin@romeagency.com';
const password = 'SuperAdmin2025!';
const tenant = 'wondersofrome';

async function run() {
    const authRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const { token } = await authRes.json();

    let deleted = 0;
    while(true) {
        // Fetch only 50 at a time
        const res = await fetch(`${PAYLOAD_URL}/api/inventory?where[tenant][equals]=${tenant}&limit=50&depth=0`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
            console.log('Server timeout, waiting 5s...');
            await new Promise(r => setTimeout(r, 5000));
            continue;
        }
        const data = await res.json();
        if (data.docs.length === 0) break;

        // Delete individually to be safe
        for (const d of data.docs) {
            await fetch(`${PAYLOAD_URL}/api/inventory/${d.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            deleted++;
        }
        console.log(`Deleted ${deleted}...`);
        if (deleted >= 20000) break; 
    }
    console.log(`COMPLETED: Deleted ${deleted} total slots.`);
}
run();
