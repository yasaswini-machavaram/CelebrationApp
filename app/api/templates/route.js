import { NextResponse } from 'next/server';
import { templates, getTemplatesByCategory } from '@/lib/data/templates';
import connectDB from '@/lib/mongodb';
import TemplatePricing from '@/lib/models/TemplatePricing';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let baseTemplates = templates;
    if (category && category !== 'All') {
      baseTemplates = getTemplatesByCategory(category);
    }

    // Connect to DB and fetch dynamic pricing
    await connectDB();
    const pricing = await TemplatePricing.find();
    
    // Create a dictionary for fast lookups
    const pricingMap = {};
    pricing.forEach(p => { 
      pricingMap[p.templateId] = p.price; 
    });

    // Merge prices into templates
    const result = baseTemplates.map(t => ({
      ...t,
      price: pricingMap[t.id] !== undefined ? pricingMap[t.id] : 0,
    }));

    return NextResponse.json({ success: true, templates: result });
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    // Return static templates as fallback
    return NextResponse.json({ success: true, templates }, { status: 200 });
  }
}
