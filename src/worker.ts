import { Resend } from 'resend';

type JsonValue = unknown;

interface GoogleConfig {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
}

const ADMIN_PASSCODE = 'dallas2026';

// Cloudflare Workers do not provide Node's `process`.
// Any values should come from env/secrets, never `process.env`.
function json(data: JsonValue, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {})
    }
  });
}




async function getGoogleConfig(env: Env): Promise<GoogleConfig> {
  const raw = await env.GOOGLE_CONFIG_KV.get('google-config');
  if (!raw) return {};
  try {
    return JSON.parse(raw) as GoogleConfig;
  } catch {
    return {};
  }
}

async function putGoogleConfig(env: Env, config: GoogleConfig) {
  await env.GOOGLE_CONFIG_KV.put('google-config', JSON.stringify(config));
}

async function getFreshAccessToken(env: Env, config: GoogleConfig): Promise<string> {
  const clientId = config.clientId || (env.GOOGLE_CLIENT_ID as string | undefined);
  const clientSecret = config.clientSecret || (env.GOOGLE_CLIENT_SECRET as string | undefined);
  const refreshToken = config.refreshToken;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth is not fully configured on the server yet');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to refresh Google OAuth token: ${errText}`);
  }

  const data = (await res.json()) as { access_token: string };
  config.accessToken = data.access_token;
  await putGoogleConfig(env, config);
  return data.access_token;
}

async function appendRegistrationBackup(env: Env, reg: any) {
  // KV doesn't support append; we store an array under a single key.
  const existingRaw = await env.REGISTRATIONS_KV.get('registrations');
  let existing: any[] = [];
  if (existingRaw) {
    try {
      existing = JSON.parse(existingRaw);
    } catch {
      existing = [];
    }
  }
  existing.push(reg);
  await env.REGISTRATIONS_KV.put('registrations', JSON.stringify(existing));
}

async function handleApi(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method.toUpperCase();

  const resend = new Resend(env.RESEND_API_KEY);

  if (path === '/api/google/status' && method === 'GET') {
    const config = await getGoogleConfig(env);
    const hasClientCredentials = !!(config.clientId || env.GOOGLE_CLIENT_ID) && !!(config.clientSecret || env.GOOGLE_CLIENT_SECRET);
    return json({
      connected: !!config.refreshToken,
      spreadsheetId: config.spreadsheetId || null,
      spreadsheetUrl: config.spreadsheetUrl || null,
      hasClientCredentials,
      clientId: config.clientId || env.GOOGLE_CLIENT_ID || null
    });
  }

  if (path === '/api/admin/verify' && method === 'POST') {
    const body = await req.json().catch(() => ({}));
    const passcode = body?.passcode;
    if (passcode === (env.ADMIN_PASSCODE || ADMIN_PASSCODE)) {
      return json({ success: true });
    }
    return json({ success: false, error: 'Invalid passcode' }, { status: 401 });
  }

  if (path === '/api/google/credentials' && method === 'POST') {
    const body = await req.json().catch(() => ({}));
    const { clientId, clientSecret } = body || {};
    if (!clientId || !clientSecret) {
      return json({ error: 'Client ID and Client Secret are required' }, { status: 400 });
    }
    const config = await getGoogleConfig(env);
    config.clientId = clientId;
    config.clientSecret = clientSecret;
    await putGoogleConfig(env, config);
    return json({ success: true });
  }

  if (path === '/api/google/auth-url' && method === 'GET') {
    const config = await getGoogleConfig(env);
    const clientId = config.clientId || env.GOOGLE_CLIENT_ID;
    const clientSecret = config.clientSecret || env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return json({ error: 'Google OAuth credentials have not been configured yet' }, { status: 400 });
    }

    const requestHost = url.host || 'localhost';
    const protocol = url.protocol === 'https:' ? 'https' : 'http';
    const redirectUri = `${protocol}://${requestHost}/api/google/callback`;

    const scope = encodeURIComponent('https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    return json({ authUrl });
  }

  if (path === '/api/google/callback' && method === 'GET') {
    const code = url.searchParams.get('code');
    if (!code) return new Response('OAuth verification code is missing', { status: 400 });

    const config = await getGoogleConfig(env);
    const clientId = config.clientId || env.GOOGLE_CLIENT_ID;
    const clientSecret = config.clientSecret || env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return new Response('Client configuration is missing', { status: 400 });

    const requestHost = url.host;
    const protocol = url.protocol === 'https:' ? 'https' : 'http';
    const redirectUri = `${protocol}://${requestHost}/api/google/callback`;

    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        return new Response(`Error exchanging tokens: ${errText}`, { status: 500 });
      }

      const tokenData = (await tokenRes.json()) as { access_token: string; refresh_token?: string };

      config.accessToken = tokenData.access_token;
      if (tokenData.refresh_token) config.refreshToken = tokenData.refresh_token;

      const sheetRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: 'AIC 2026 Conference Registrations' },
          sheets: [
            {
              properties: { title: 'Registrations' },
              data: [
                {
                  startRow: 0,
                  startColumn: 0,
                  rowData: [
                    {
                      values: [
                        { userEnteredValue: { stringValue: 'Timestamp' } },
                        { userEnteredValue: { stringValue: 'Ticket Number' } },
                        { userEnteredValue: { stringValue: 'Full Name' } },
                        { userEnteredValue: { stringValue: 'Email' } },
                        { userEnteredValue: { stringValue: 'Phone' } },
                        { userEnteredValue: { stringValue: 'Country' } },
                        { userEnteredValue: { stringValue: 'State / City' } },
                        { userEnteredValue: { stringValue: 'Attendance Format' } },
                        { userEnteredValue: { stringValue: 'Days Attending' } },
                        { userEnteredValue: { stringValue: 'Visa Support Needed?' } },
                        { userEnteredValue: { stringValue: 'Church / Org' } },
                        { userEnteredValue: { stringValue: 'Ministry Title' } },
                        { userEnteredValue: { stringValue: 'Wants to Volunteer?' } },
                        { userEnteredValue: { stringValue: 'Volunteer Areas' } },
                        { userEnteredValue: { stringValue: 'Ticket Tier' } },
                        { userEnteredValue: { stringValue: 'Total Paid (USD)' } },
                        { userEnteredValue: { stringValue: 'Status' } },
                        { userEnteredValue: { stringValue: 'UTM Source' } }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        })
      });

      if (sheetRes.ok) {
        const sheetData = (await sheetRes.json()) as { spreadsheetId: string; spreadsheetUrl: string };
        config.spreadsheetId = sheetData.spreadsheetId;
        config.spreadsheetUrl = sheetData.spreadsheetUrl;
      }

      await putGoogleConfig(env, config);
      return Response.redirect(`${protocol}://${requestHost}/?connected=true`, 302);
    } catch (err: any) {
      return new Response(`Server Error during callback: ${String(err)}`, { status: 500 });
    }
  }

  if (path === '/api/google/disconnect' && method === 'POST') {
    await env.GOOGLE_CONFIG_KV.delete('google-config');
    return json({ success: true });
  }

  if (path === '/api/register' && method === 'POST') {
    const reg = await req.json().catch(() => null);
    if (!reg || !reg.attendee?.fullName) {
      return json({ error: 'Invalid registration payload' }, { status: 400 });
    }

    await appendRegistrationBackup(env, reg);

    const config = await getGoogleConfig(env);
    if (config.refreshToken && config.spreadsheetId) {
      try {
        const token = await getFreshAccessToken(env, config);

        const rowValues = [
          new Date(reg.date).toLocaleString(),
          reg.ticketNumber,
          reg.attendee.fullName,
          reg.attendee.email,
          reg.attendee.phone,
          reg.attendee.country,
          reg.attendee.stateCity,
          reg.attendance.type,
          reg.attendance.days.join(', '),
          reg.attendance.requestVisaLetter ? 'Yes' : 'No',
          reg.ministry.organization,
          reg.ministry.roleTitle,
          reg.ministry.wantsToVolunteer ? 'Yes' : 'No',
          (reg.ministry.volunteerRoles || []).join(', '),
          reg.payment.ticketType,
          `$${(reg.payment.totalPaid || 0).toFixed(2)}`,
          reg.status,
          reg.utmSource || ''
        ];

        const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/Registrations!A:R:append?valueInputOption=USER_ENTERED`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            range: 'Registrations!A:R',
            majorDimension: 'ROWS',
            values: [rowValues]
          })
        });

        if (!appendRes.ok) {
          console.error('Failed to append to spreadsheet', await appendRes.text());
          return json({ success: true, warning: 'Saved locally, but failed to sync to Google Sheet' });
        }

        return json({ success: true, synced: true });
      } catch (e: any) {
        console.error('Failed to write to Google Sheets securely: ', e?.message || e);
        return json({ success: true, warning: 'Saved locally, Google Sheet write timed out/failed' });
      }
    }

    return json({ success: true, synced: false, warning: 'Saved locally. Google Sheet is not connected.' });
  }

  if (path === '/api/contact' && method === 'POST') {
    const body = await req.json().catch(() => ({}));
    const { name, email, subject, message } = body || {};

    if (!name || !email || !message) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const senderEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const { data, error } = await resend.emails.send({
        from: `AIC Website <${senderEmail}>`,
        to: ['Lukas@heartforthecity.co.uk'],
        replyTo: email,
        subject: `New Contact Form Submission - ${subject || 'Contact'}`,
        html: `
          <h2 style="color: #dc2626;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Category:</strong> ${subject || ''}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        `
      });

      if (error) return json(error, { status: 400 });
      return json({ success: true, data });
    } catch (e: any) {
      console.error('Email submission error:', e);
      return json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  return new Response('Not Found', { status: 404 });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname.startsWith('/api/')) {
      return handleApi(req, env);
    }

    // SPA fallback: serve index.html from assets.
    const indexResp = await fetch('/index.html', { headers: req.headers });
    if (indexResp.ok) return indexResp;

    return new Response('index.html not found. Configure Wrangler assets or deploy via Cloudflare Pages.', { status: 500 });
  }
};

export interface Env {
  GOOGLE_CONFIG_KV: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string) => Promise<void>;
    delete: (key: string) => Promise<void>;
  };
  REGISTRATIONS_KV: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string) => Promise<void>;
    delete: (key: string) => Promise<void>;
  };

  ADMIN_PASSCODE?: string;

  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL?: string;

  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

