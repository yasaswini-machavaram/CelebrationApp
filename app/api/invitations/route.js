import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invitation from '@/lib/models/Invitation';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Attach userId if logged in
    const authUser = getAuthUser(request);
    if (authUser) {
      body.userId = authUser.userId;
    }

    const invitation = await Invitation.create(body);

    return NextResponse.json(
      { success: true, invitation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create invitation error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'An invitation with this slug already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const invitation = await Invitation.findOne({ slug });
      if (!invitation) {
        return NextResponse.json(
          { success: false, error: 'Invitation not found' },
          { status: 404 }
        );
      }

      // If invitation is not active, return expired state
      if (!invitation.isActive) {
        return NextResponse.json({
          success: false,
          expired: true,
          invitationId: invitation._id,
          templateId: invitation.templateId,
          error: 'This invitation link has been deactivated.',
        }, { status: 410 });
      }

      // ─── PAID invitations: skip free-timer logic entirely ─────
      if (invitation.isPaid) {
        return NextResponse.json({ success: true, invitation });
      }

      // ─── SAMPLE invitations: permanent, no timer ──────────────
      if (invitation.isSample) {
        return NextResponse.json({ success: true, invitation });
      }

      // ─── UNPAID invitations: track first view and enforce 60s expiry
      const now = new Date();

      if (!invitation.freeViewedAt) {
        // First time being opened — start the 60s clock
        invitation.freeViewedAt = now;
        invitation.expiresAt = new Date(now.getTime() + 60 * 1000);
        await invitation.save();
      } else if (invitation.expiresAt && now > invitation.expiresAt) {
        // 60 seconds have passed — deactivate link
        invitation.isActive = false;
        await invitation.save();
        return NextResponse.json({
          success: false,
          expired: true,
          invitationId: invitation._id,
          templateId: invitation.templateId,
          error: 'Free preview expired. Upgrade to restore access.',
        }, { status: 410 });
      }

      return NextResponse.json({ success: true, invitation });
    }

    const invitations = await Invitation.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, invitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── PATCH: Reactivate after payment ────────────────────────────
export async function PATCH(request) {
  try {
    await connectDB();
    const { invitationId, isPaid } = await request.json();

    if (!invitationId) {
      return NextResponse.json(
        { success: false, error: 'Invitation ID required.' },
        { status: 400 }
      );
    }

    const updates = {};
    if (isPaid) {
      updates.isPaid = true;
      updates.isActive = true;
      updates.paidAt = new Date();
      updates.expiresAt = null;
      updates.freeViewedAt = null;
    }

    const invitation = await Invitation.findByIdAndUpdate(
      invitationId,
      updates,
      { new: true }
    );

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, invitation });
  } catch (error) {
    console.error('Patch invitation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
