import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Invitation from '@/lib/models/Invitation';
import { requireAuth } from '@/lib/auth';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

function isRazorpayConfigured() {
  return RAZORPAY_KEY_SECRET && !RAZORPAY_KEY_SECRET.includes('your_');
}

export async function POST(request) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invitationId,
    } = await request.json();

    if (!razorpay_order_id) {
      return NextResponse.json({ success: false, error: 'Missing order ID.' }, { status: 400 });
    }

    const isMock = razorpay_order_id.startsWith('mock_order_');

    if (!isMock && isRazorpayConfigured()) {
      // ─── Real Razorpay signature verification ───────────────────
      if (!razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ success: false, error: 'Missing payment details.' }, { status: 400 });
      }

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          { status: 'failed' }
        );
        return NextResponse.json({ success: false, error: 'Payment verification failed.' }, { status: 400 });
      }
    }

    // ─── Update payment record ──────────────────────────────────
    const mockPaymentId = isMock
      ? `mock_pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      : razorpay_payment_id;

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: razorpay_signature || 'mock_signature',
        status: 'paid',
        invitationId: invitationId || undefined,
      },
      { new: true }
    );

    // ─── Mark invitation as paid & reactivate ───────────────────
    if (invitationId) {
      const now = new Date();
      const paidExpiresAt = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000); // 20 Days
      const deletionAt = new Date(now.getTime() + 24 * 24 * 60 * 60 * 1000);    // 24 Days

      await Invitation.findByIdAndUpdate(invitationId, {
        isPaid: true,
        isActive: true,
        paidAt: now,
        paidExpiresAt: paidExpiresAt,
        deletionAt: deletionAt,
        expiresAt: null,        // clear the 60s expiry
        freeViewedAt: null,     // clear so countdown doesn't show
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully!',
      paymentId: payment?._id,
    });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    console.error('Verify payment error:', error);
    return NextResponse.json({ success: false, error: 'Verification failed.' }, { status: 500 });
  }
}
