import { NextResponse } from 'next/server';
import { getAllClients, createClient, updateClient, deleteClient } from '@/lib/db';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const clients = await getAllClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Nome cliente obbligatorio' }, { status: 400 });
    }
    const client = await createClient({
      id: generateId(),
      name: body.name,
      color: body.color,
    });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('POST /api/clients error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ error: 'ID e nome obbligatori' }, { status: 400 });
    }
    const client = await updateClient(body.id, { name: body.name, color: body.color });
    return NextResponse.json(client);
  } catch (error) {
    console.error('PUT /api/clients error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID obbligatorio' }, { status: 400 });
    await deleteClient(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/clients error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
