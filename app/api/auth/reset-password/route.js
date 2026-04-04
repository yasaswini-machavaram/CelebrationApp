import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { username, mobile, newPassword } = await request.json();

    if (!username || !mobile || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 4 characters.' },
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

    // Verify mobile matches
    if (user.mobile.trim() !== mobile.trim()) {
      return NextResponse.json(
        { success: false, error: 'Mobile number does not match our records.' },
        { status: 403 }
      );
    }

    // Reset password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now login.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
