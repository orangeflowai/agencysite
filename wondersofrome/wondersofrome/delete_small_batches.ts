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

    let total = 0;
    while (true) {
        // Query only 20 at a time
        const res = await fetch(`${PAYLOAD_URL}/api/inventory?where[tenant][equals]=wondersofrome&limit=20&depth=0`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
            console.error('Error fetching batch, retrying in 5s...');
            await new Promise(r => setTimeout(r, 5000));
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
        // Add a small delay to prevent overloading
        await new Promise(r => setTimeout(r, 100));
    }
}
run();
