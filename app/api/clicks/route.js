import { NextResponse } from 'next/server';
import { getClickStats, getClientStats } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('link_id');
    const clientId = searchParams.get('client_id');

    if (linkId) {
      const stats = await getClickStats(linkId);
      return NextResponse.json(stats);
    }

    if (clientId) {
      const stats = await getClientStats(clientId);
      return NextResponse.json(stats);
    }

    return NextResponse.json({ error: 'Specifica link_id o client_id' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
