import { NextResponse } from 'next/server';
import { getAllLinks, createLink, updateLink, deleteLink } from '@/lib/db';
import { generateId, generateShortCode } from '@/lib/utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const links = await getAllLinks(clientId || null);
    return NextResponse.json(links);
  } catch (error) {
    console.error('GET /api/links error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.client_id || !body.destination_url) {
      return NextResponse.json({ error: 'Client ID e URL destinazione obbligatori' }, { status: 400 });
    }

    try {
      new URL(body.destination_url);
    } catch {
      return NextResponse.json({ error: 'URL non valido' }, { status: 400 });
    }

    const link = await createLink({
      id: generateId(),
      short_code: body.short_code || generateShortCode(),
      client_id: body.client_id,
      destination_url: body.destination_url,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_term: body.utm_term,
      utm_content: body.utm_content,
      label: body.label,
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('POST /api/links error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'ID obbligatorio' }, { status: 400 });
    const link = await updateLink(body.id, body);
    return NextResponse.json(link);
  } catch (error) {
    console.error('PUT /api/links error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID obbligatorio' }, { status: 400 });
    await deleteLink(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/links error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
