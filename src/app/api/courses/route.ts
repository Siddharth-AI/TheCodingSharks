import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const courseType = request.nextUrl.searchParams.get('courseType') ?? 'all';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CRM_API_URL}/api/public/courses?courseType=${courseType}`,
    { next: { revalidate: 300 } }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
