import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const payments = await Payment.find()
      .populate('userId', 'username email mobile')
      .populate('invitationId', 'slug templateId groomName brideName isPaid isActive')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
