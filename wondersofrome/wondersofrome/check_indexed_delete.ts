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

    // Try finding by date (which is usually indexed)
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(`${PAYLOAD_URL}/api/inventory?where[date][greater_than_equal]=${today}&limit=10&depth=0`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Sample future slots found:', data.docs.length);
}
run();
