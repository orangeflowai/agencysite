export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, message } = body;

        if (!firstName || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const brandName = process.env.NEXT_PUBLIC_SITE_NAME || 'Golden Rome Tours';
        const sender = process.env.EMAIL_FROM || 'onboarding@resend.dev';
        const recipient = process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.ADMIN_EMAIL || 'goldenrometours@gmail.com';

        const esc = (s: string) => s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        const data = await resend.emails.send({
            from: `${brandName} <${sender}>`,
            to: [recipient],
            subject: `New Contact Message from ${firstName} ${lastName || ''}`,
            replyTo: email,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>New Message Received</h2>
                    <p><strong>Name:</strong> ${esc(firstName)} ${esc(lastName || '')}</p>
                    <p><strong>Email:</strong> ${esc(email)}</p>
                    <p><strong>Phone:</strong> ${esc(body.phone || '—')}</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Message:</strong></p>
                        <p>${esc(message).replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            `
        });

        if (data.error) {
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
