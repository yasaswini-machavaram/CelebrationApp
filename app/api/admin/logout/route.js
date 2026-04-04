import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    clearAuthCookie(true); // isAdmin = true → clears admin_token cookie
    return NextResponse.json({ success: true, message: 'Admin logged out.' });
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed.' },
      { status: 500 }
    );
  }
}
