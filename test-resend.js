const { Resend } = require('resend');

const resend = new Resend('re_GtXjh56Y_5m8EnUQyA8T5mGA3m8epSVyS');

async function testResend() {
    try {
        console.log('Testing Resend API...');
        
        const result = await resend.emails.send({
            from: 'test@ticketsinrome.com',
            to: 'test@example.com',
            subject: 'Test Email from Tickets in Rome',
            html: '<h1>Test Email</h1><p>This is a test email to verify Resend is working.</p>'
        });
        
        console.log('✅ Resend API is working!');
        console.log('Result:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('❌ Resend API Error:');
        console.error('Error message:', error.message);
        console.error('Error details:', error);
    }
}

testResend();