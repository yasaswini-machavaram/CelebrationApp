import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invitation from '@/lib/models/Invitation';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const invitations = await Invitation.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, invitations });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const { id, isActive } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Invitation ID required.' }, { status: 400 });
    }

    const updated = await Invitation.findByIdAndUpdate(id, { isActive }, { new: true });
    return NextResponse.json({ success: true, invitation: updated });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Invitation ID required.' }, { status: 400 });
    }

    await Invitation.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Invitation deleted.' });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
