import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Image constraints
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const RECOMMENDED_DIMENSION = 800; // 800x800px square recommended

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate format
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid format. Allowed: JPEG, PNG, WebP` },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Max size: 5MB` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return public URL path
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      format: file.type,
      constraints: {
        maxSize: '5MB',
        allowedFormats: ['JPEG', 'PNG', 'WebP'],
        recommendedDimension: `${RECOMMENDED_DIMENSION}x${RECOMMENDED_DIMENSION}px (square)`,
        maxImages: 5,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
