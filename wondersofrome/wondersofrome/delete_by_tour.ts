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

    // 1. Get all Tours for wondersofrome
    const tourRes = await fetch(`${PAYLOAD_URL}/api/tours?where[tenant][equals]=wondersofrome&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const tours = await tourRes.json();
    console.log(`Found ${tours.docs.length} tours for WondersOfRome.`);

    for (const tour of tours.docs) {
        console.log(`Deleting inventory for tour: ${tour.title} (ID: ${tour.id})`);
        let tourDeleted = 0;
        while(true) {
            const res = await fetch(`${PAYLOAD_URL}/api/inventory?where[tour][equals]=${tour.id}&limit=50&depth=0`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) break;
            const data = await res.json();
            if (data.docs.length === 0) break;

            for (const d of data.docs) {
                await fetch(`${PAYLOAD_URL}/api/inventory/${d.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                tourDeleted++;
            }
            console.log(`Deleted ${tourDeleted} for this tour...`);
        }
    }
}
run();
