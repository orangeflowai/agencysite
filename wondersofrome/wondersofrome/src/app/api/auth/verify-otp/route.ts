import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();
    if (!email || !token) {
      return NextResponse.json({ error: 'Email and verification code required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        return NextResponse.json({ error: 'Invalid or expired code. Please request a new one.' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: { id: data.user.id, email: data.user.email },
      session: data.session ? { access_token: data.session.access_token } : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
