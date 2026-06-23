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

    console.log('Attempting Bulk Delete via Query...');
    // Payload supports DELETE on collection with where
    const res = await fetch(`${PAYLOAD_URL}/api/inventory?where[tenant][equals]=wondersofrome`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
}
run();
