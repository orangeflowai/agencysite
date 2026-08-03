export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, message } = body;

        if (!firstName || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const safeFirstName = escapeHtml(firstName || '');
        const safeLastName = escapeHtml(lastName || '');
        const safeEmail = escapeHtml(email || '');
        const safeMessage = escapeHtml(message || '').replace(/\n/g, '<br>');

        const data = await resend.emails.send({
            from: `Contact Form <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
            to: [process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@romanvaticantour.com'],
            subject: `New Contact Message from ${safeFirstName} ${safeLastName || ''}`,
            replyTo: email,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>New Message Received</h2>
                    <p><strong>Name:</strong> ${safeFirstName} ${safeLastName || ''}</p>
                    <p><strong>Email:</strong> ${safeEmail}</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Message:</strong></p>
                        <p>${safeMessage}</p>
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
