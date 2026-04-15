import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);
const shortCode = customAlphabet(alphabet, 6);

export function generateId() {
  return nanoid();
}

export function generateShortCode() {
  return shortCode();
}

export function buildUtmUrl(baseUrl, params) {
  try {
    const url = new URL(baseUrl);
    if (params.utm_source) url.searchParams.set('utm_source', params.utm_source);
    if (params.utm_medium) url.searchParams.set('utm_medium', params.utm_medium);
    if (params.utm_campaign) url.searchParams.set('utm_campaign', params.utm_campaign);
    if (params.utm_term) url.searchParams.set('utm_term', params.utm_term);
    if (params.utm_content) url.searchParams.set('utm_content', params.utm_content);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export function parseUserAgent(uaString) {
  try {
    const UAParser = require('ua-parser-js');
    const parser = new UAParser(uaString);
    const r = parser.getResult();
    return {
      browser: r.browser.name || 'Unknown',
      os: r.os.name || 'Unknown',
      device: r.device.type || 'desktop',
    };
  } catch {
    return { browser: 'Unknown', os: 'Unknown', device: 'desktop' };
  }
}

export const CLIENT_COLORS = [
  '#4c6ef5', '#7950f2', '#be4bdb', '#e64980', '#fa5252',
  '#fd7e14', '#fab005', '#40c057', '#12b886', '#15aabf',
  '#339af0', '#1c7ed6', '#845ef7', '#f06595', '#ff6b6b',
];
