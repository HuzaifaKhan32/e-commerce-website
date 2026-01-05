
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, code } = await req.json();

    if (!email || !password || !name || !code) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

        // Verify code
        const { data: verificationData, error: verifyError } = await supabaseAdmin
          .from('two_factor_codes')
          .select('*')
          .eq('email', email)
          .eq('code', code)
          .single();
    
        if (verifyError || !verificationData) {
          return NextResponse.json({ message: 'Invalid or expired verification code' }, { status: 400 });
        }
    
        // Check expiry
        if (new Date(verificationData.expires_at) < new Date()) {
          return NextResponse.json({ message: 'Verification code has expired' }, { status: 400 });
        }
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create user
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert([
            {
              email,
              password: hashedPassword,
              name,
              role: 'user',
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();
    
        if (createError) {
          if (createError.code === '23505') {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
          }
          console.error('Create user error:', createError);
          return NextResponse.json({ 
            message: 'Failed to create user', 
            error: createError.message 
          }, { status: 500 });
        }
    
        // Delete verification code
        await supabaseAdmin
          .from('two_factor_codes')
          .delete()
          .eq('email', email);
    return NextResponse.json({ 
      message: 'User created successfully',
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error.message || 'Unknown error' 
    }, { status: 500 });
  }
}
