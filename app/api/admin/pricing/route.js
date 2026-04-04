import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TemplatePricing from '@/lib/models/TemplatePricing';
import { requireAdmin } from '@/lib/auth';
import { templates } from '@/lib/data/templates';

export async function GET(request) {
  try {
    requireAdmin(request);
    await connectDB();

    // Get all pricing from DB
    const pricing = await TemplatePricing.find();
    const pricingMap = {};
    pricing.forEach(p => { pricingMap[p.templateId] = p.price; });

    // Merge with template data
    const result = templates.map(t => ({
      templateId: t.id,
      name: t.name,
      category: t.category,
      price: pricingMap[t.id] !== undefined ? pricingMap[t.id] : 0,
    }));

    return NextResponse.json({ success: true, pricing: result });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    requireAdmin(request);
    await connectDB();

    const { templateId, price } = await request.json();
    if (!templateId || price === undefined || price === null) {
      return NextResponse.json({ success: false, error: 'Template ID and price required.' }, { status: 400 });
    }

    const priceInPaise = Math.round(Number(price));
    if (isNaN(priceInPaise) || priceInPaise < 0) {
      return NextResponse.json({ success: false, error: 'Invalid price.' }, { status: 400 });
    }

    const updated = await TemplatePricing.findOneAndUpdate(
      { templateId },
      { price: priceInPaise, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, pricing: updated });
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
