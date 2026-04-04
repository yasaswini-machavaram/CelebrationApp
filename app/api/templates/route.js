import { NextResponse } from 'next/server';
import { templates, getTemplatesByCategory } from '@/lib/data/templates';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const result = category ? getTemplatesByCategory(category) : templates;

  return NextResponse.json({ success: true, templates: result });
}
