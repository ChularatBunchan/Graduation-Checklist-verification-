import { write } from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';

async function POST(request) {
  const data = await request.formData();
  const file = data.get('file');

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = `/tmp/${file.name}`;
  await write(buffer,path);
  console.log(`open ${path} to see the uploaded file`);

  return NextResponse.json({ success: true });
}

export default {
  POST
};
