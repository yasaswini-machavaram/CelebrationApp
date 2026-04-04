import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const decoded = getAuthUser(request);
    if (!decoded) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
