import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated as admin.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed.' },
      { status: 500 }
    );
  }
}
