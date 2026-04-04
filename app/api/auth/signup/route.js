import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { username, password, email, mobile } = await request.json();

    if (!username || !password || !email || !mobile) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { success: false, error: 'Username must be 3-30 characters.' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 4 characters.' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existing = await User.findOne({ username: username.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Username already taken.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      email: email.trim(),
      mobile: mobile.trim(),
    });

    return NextResponse.json(
      { success: true, message: 'Account created successfully!', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Username already taken.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
