import { NextRequest, NextResponse } from 'next/server';
import { WorkshopService } from '@/backend/services/workshop';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // get crm_workshop_name for notes
    const workshop = await WorkshopService.getBySlug(slug);

    const res = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_URL}/api/public/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CRM_EXTERNAL_API_KEY ?? '',
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        courseInterest: body.courseInterest ?? undefined,
        notes: body.notes ?? `Workshop: ${workshop.crm_workshop_name}`,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const msg = (error as Error).message;
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
