import { NextResponse } from 'next/server';
import { getLinkByCode, recordClick } from '@/lib/db';
import { buildUtmUrl, parseUserAgent } from '@/lib/utils';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { code } = params;
  const link = await getLinkByCode(code);

  if (!link) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Parse request info
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const referer = headersList.get('referer') || '';
  const forwarded = headersList.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || 'unknown';
  const ua = parseUserAgent(userAgent);

  // Record click (non-blocking)
  try {
    await recordClick({
      link_id: link.id,
      ip_address: ip,
      user_agent: userAgent,
      referer: referer,
      country: '',
      device: ua.device,
      browser: ua.browser,
      os: ua.os,
    });
  } catch (e) {
    console.error('Failed to record click:', e);
  }

  // Build destination URL with UTM params and redirect
  const destinationUrl = buildUtmUrl(link.destination_url, {
    utm_source: link.utm_source,
    utm_medium: link.utm_medium,
    utm_campaign: link.utm_campaign,
    utm_term: link.utm_term,
    utm_content: link.utm_content,
  });

  return NextResponse.redirect(destinationUrl, 302);
}
