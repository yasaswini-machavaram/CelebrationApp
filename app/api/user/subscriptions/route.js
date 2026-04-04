import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invitation from '@/lib/models/Invitation';
import Payment from '@/lib/models/Payment';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = requireAuth(request);
    await connectDB();

    // Get all invitations for this user
    const invitations = await Invitation.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get all payments for this user
    const payments = await Payment.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Build a lookup: invitationId → payment
    const paymentByInvitation = {};
    const paymentByTemplate = {};
    for (const p of payments) {
      if (p.invitationId) {
        paymentByInvitation[p.invitationId.toString()] = p;
      }
      // Also index by templateId + status for matching
      if (p.status === 'paid') {
        if (!paymentByTemplate[p.templateId]) {
          paymentByTemplate[p.templateId] = p;
        }
      }
    }

    // Enrich invitations with payment data
    const enriched = invitations.map(inv => {
      const invId = inv._id.toString();
      let payment = paymentByInvitation[invId] || null;

      // If no direct link, try matching by templateId
      if (!payment && inv.isPaid && inv.templateId) {
        payment = paymentByTemplate[inv.templateId] || null;
      }

      return {
        ...inv,
        payment: payment ? {
          _id: payment._id,
          amount: payment.amount,
          status: payment.status,
          razorpayPaymentId: payment.razorpayPaymentId,
          razorpayOrderId: payment.razorpayOrderId,
          createdAt: payment.createdAt,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      subscriptions: enriched,
    });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    console.error('Subscriptions error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
