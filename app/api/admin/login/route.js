import { NextResponse } from 'next/server';
import { signToken, setAuthCookie } from '@/lib/auth';

const ADMIN_USERNAME = 'upgrade';
const ADMIN_PASSWORD = '1234';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    const token = signToken('admin', 'admin');
    setAuthCookie(token, true); // isAdmin = true

    return NextResponse.json({
      success: true,
      message: 'Admin login successful.',
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
