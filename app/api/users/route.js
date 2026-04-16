import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { getAllUsers, updateUserStatus, deleteUser } from '@/lib/db';

function requireAdmin() {
  const token = cookies().get('utm_session')?.value;
  const session = verifySessionToken(token);
  if (!session || session.role !== 'admin') return null;
  return session;
}

export async function GET() {
  if (!requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request) {
  if (!requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  try {
    const { id, is_active } = await request.json();
    await updateUserStatus(id, is_active);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!requireAdmin()) return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
