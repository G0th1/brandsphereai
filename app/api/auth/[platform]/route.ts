import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  // Temporär respons för att få bygget att fungera
  return NextResponse.json({ url: "https://example.com/" });
} 