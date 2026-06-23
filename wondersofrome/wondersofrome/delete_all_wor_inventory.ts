const PAYLOAD_URL = 'https://admin.wondersofrome.com';
const email = 'superadmin@romeagency.com';
const password = 'SuperAdmin2025!';
const tenant = 'wondersofrome';

async function run() {
    console.log('Authenticating...');
    const authRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const { token } = await authRes.json();

    console.log('Fetching slots to delete...');
    let totalDeleted = 0;
    let hasMore = true;

    while (hasMore) {
        // Fetch a batch of 100
        const res = await fetch(`${PAYLOAD_URL}/api/inventory?where[tenant][equals]=${tenant}&limit=100&depth=0`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const docs = data.docs || [];
        
        if (docs.length === 0) {
            hasMore = false;
            break;
        }

        console.log(`Batch of ${docs.length} found. Deleting...`);
        
        // Delete batch in parallel
        await Promise.all(docs.map((d: any) => 
            fetch(`${PAYLOAD_URL}/api/inventory/${d.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
        ));

        totalDeleted += docs.length;
        console.log(`Progress: ${totalDeleted} deleted...`);
        
        if (totalDeleted > 25000) break; // Safety break
    }

    console.log(`FINISHED: Deleted ${totalDeleted} inventory slots for WondersOfRome.`);
}

run();
