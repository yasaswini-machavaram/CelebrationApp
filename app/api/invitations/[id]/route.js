import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invitation from '@/lib/models/Invitation';
import { requireAuth } from '@/lib/auth';

// ─── GET: Fetch single invitation by ID (for edit form pre-fill) ────────────
export async function GET(request, { params }) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const invitation = await Invitation.findById(params.id);
    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found.' },
        { status: 404 }
      );
    }

    // Only the owner can fetch for editing
    if (invitation.userId?.toString() !== user.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, invitation });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    console.error('Get invitation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── PUT: Update invitation (paid users get exactly 1 edit) ─────────────────
export async function PUT(request, { params }) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const invitation = await Invitation.findById(params.id);
    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found.' },
        { status: 404 }
      );
    }

    // Only the owner can edit
    if (invitation.userId?.toString() !== user.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized.' },
        { status: 403 }
      );
    }

    // Must be a paid invitation
    if (!invitation.isPaid) {
      return NextResponse.json(
        { success: false, error: 'Only paid invitations can be edited.' },
        { status: 400 }
      );
    }

    // Check edit limit — maximum 1 edit allowed
    if (invitation.editCount >= 1) {
      return NextResponse.json(
        { success: false, error: 'Edit limit reached. Please contact admin for further changes.' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Fields that can be updated
    const editableFields = [
      'groomName', 'brideName', 'groomParents', 'brideParents',
      'groomFamily', 'brideFamily', 'weddingDate', 'tagline',
      'coupleStory', 'galleryImages', 'events',
    ];

    const updates = {};
    for (const field of editableFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Increment edit count and record timestamp
    updates.editCount = (invitation.editCount || 0) + 1;
    updates.lastEditedAt = new Date();

    const updated = await Invitation.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    );

    return NextResponse.json({ success: true, invitation: updated });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    console.error('Update invitation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
