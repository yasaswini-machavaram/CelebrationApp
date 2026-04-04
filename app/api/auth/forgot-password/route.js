import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Username not found.' },
        { status: 404 }
      );
    }

    // Return masked mobile for verification
    const maskedMobile = user.mobile.replace(/^(\d{2})\d+(\d{2})$/, '$1****$2');

    return NextResponse.json({
      success: true,
      maskedMobile,
      userId: user._id,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
