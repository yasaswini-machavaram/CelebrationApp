import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Invitation from '@/lib/models/Invitation';
import Payment from '@/lib/models/Payment';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 401 });
    }
    console.error('Admin users error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required.' }, { status: 400 });
    }

    // Delete user and their invitations and payments
    await Invitation.deleteMany({ userId });
    await Payment.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true, message: 'User and related data deleted.' });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 401 });
    }
    console.error('Admin delete user error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
