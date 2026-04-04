import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import TemplatePricing from '@/lib/models/TemplatePricing';
import { requireAuth } from '@/lib/auth';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

function isRazorpayConfigured() {
  return (
    RAZORPAY_KEY_ID &&
    RAZORPAY_KEY_SECRET &&
    !RAZORPAY_KEY_ID.includes('your_') &&
    !RAZORPAY_KEY_SECRET.includes('your_')
  );
}

export async function POST(request) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { templateId, invitationId } = await request.json();
    if (!templateId) {
      return NextResponse.json({ success: false, error: 'Template ID required.' }, { status: 400 });
    }

    // Get price from DB
    const pricing = await TemplatePricing.findOne({ templateId });
    if (!pricing) {
      return NextResponse.json({ success: false, error: 'Template pricing not configured. Contact admin.' }, { status: 400 });
    }

    if (pricing.price === 0) {
      return NextResponse.json({ success: true, free: true, message: 'This template is free!' });
    }

    if (isRazorpayConfigured()) {
      // ─── Real Razorpay mode ─────────────────────────────────────
      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });

      const order = await razorpay.orders.create({
        amount: pricing.price,
        currency: 'INR',
        receipt: `rcpt_${user.userId}_${Date.now()}`,
        notes: { templateId, userId: user.userId },
      });

      await Payment.create({
        userId: user.userId,
        razorpayOrderId: order.id,
        amount: pricing.price,
        templateId,
        invitationId: invitationId || undefined,
        status: 'created',
      });

      return NextResponse.json({
        success: true,
        free: false,
        mock: false,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        },
      });
    } else {
      // ─── Mock mode (no Razorpay keys) ───────────────────────────
      const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      await Payment.create({
        userId: user.userId,
        razorpayOrderId: mockOrderId,
        amount: pricing.price,
        templateId,
        invitationId: invitationId || undefined,
        status: 'created',
      });

      return NextResponse.json({
        success: true,
        free: false,
        mock: true,
        order: {
          id: mockOrderId,
          amount: pricing.price,
          currency: 'INR',
        },
      });
    }
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Login required.' }, { status: 401 });
    }
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order.' }, { status: 500 });
  }
}
