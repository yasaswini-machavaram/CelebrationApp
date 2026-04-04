import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username || username.length < 3) {
      return NextResponse.json({ available: false, error: 'Too short' });
    }

    await connectDB();
    const existing = await User.findOne({ username: username.toLowerCase().trim() });

    return NextResponse.json({ available: !existing });
  } catch (error) {
    console.error('Check username error:', error);
    return NextResponse.json({ available: false, error: 'Server error' }, { status: 500 });
  }
}
