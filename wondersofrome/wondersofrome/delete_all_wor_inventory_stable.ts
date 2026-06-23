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

    let totalDeleted = 0;
    while (true) {
        const res = await fetch(`${PAYLOAD_URL}/api/inventory?where[tenant][equals]=${tenant}&limit=50&depth=0`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) break;
        const data = await res.json();
        const docs = data.docs || [];
        if (docs.length === 0) break;

        for (const d of docs) {
            await fetch(`${PAYLOAD_URL}/api/inventory/${d.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            totalDeleted++;
        }
        console.log(`Deleted ${totalDeleted}...`);
        if (totalDeleted > 25000) break;
    }
    console.log(`FINISHED: ${totalDeleted} slots removed.`);
}
run();
