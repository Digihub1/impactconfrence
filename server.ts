import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'dallas2026';
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CONFIG_PATH = path.join(DATA_DIR, 'google-config.json');
const REGISTRATIONS_PATH = path.join(DATA_DIR, 'registrations.json');

// Helper to read Google Config
interface GoogleConfig {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
}

function readConfig(): GoogleConfig {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (e) {
      console.error('Error reading google-config.json', e);
    }
  }
  return {};
}

function writeConfig(config: GoogleConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

// Helper to refresh Google Sheets active access token
async function getFreshAccessToken(config: GoogleConfig): Promise<string> {
  const clientId = config.clientId || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = config.clientSecret || process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = config.refreshToken;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth is not fully configured on the server yet');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

  const data = await res.json() as { access_token: string };
  config.accessToken = data.access_token;
  writeConfig(config);
  return data.access_token;
}

// Express backend API routes
// 1. Google connection status
app.get('/api/google/status', (req, res) => {
  const config = readConfig();
  const hasClientCredentials = !(!(config.clientId || process.env.GOOGLE_CLIENT_ID) || !(config.clientSecret || process.env.GOOGLE_CLIENT_SECRET));
  res.json({
    connected: !!config.refreshToken,
    spreadsheetId: config.spreadsheetId || null,
    spreadsheetUrl: config.spreadsheetUrl || null,
    hasClientCredentials,
    clientId: config.clientId || process.env.GOOGLE_CLIENT_ID || null
  });
});

// 1b. Verify Admin Passcode
app.post('/api/admin/verify', (req, res) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    res.json({ success: true });
    return;
  }
  res.status(401).json({ success: false, error: 'Invalid passcode' });
});

// 2. Save custom Client ID & Secret
app.post('/api/google/credentials', (req, res) => {
  const { clientId, clientSecret } = req.body;
  if (!clientId || !clientSecret) {
    res.status(400).json({ error: 'Client ID and Client Secret are required' });
    return;
  }
  const config = readConfig();
  config.clientId = clientId;
  config.clientSecret = clientSecret;
  writeConfig(config);
  res.json({ success: true });
});

// 3. Initiate Google OAuth Flow
app.get('/api/google/auth-url', (req, res) => {
  const config = readConfig();
  const clientId = config.clientId || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = config.clientSecret || process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(400).json({ error: 'Google OAuth credentials have not been configured yet' });
    return;
  }

  // Determine dynamic redirect URI
  const requestHost = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const redirectUri = `${protocol}://${requestHost}/api/google/callback`;

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file')}&access_type=offline&prompt=consent`;
  
  res.json({ authUrl });
});

// 4. OAuth Callback redirect handler
app.get('/api/google/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).send('OAuth verification code is missing');
    return;
  }

  const config = readConfig();
  const clientId = config.clientId || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = config.clientSecret || process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(400).send('Client configuration is missing');
    return;
  }

  const requestHost = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const redirectUri = `${protocol}://${requestHost}/api/google/callback`;

  try {
    // Exchange authorize code for access & refresh tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
      res.status(500).send(`Error exchanging tokens: ${errText}`);
      return;
    }

    const tokenData = await tokenRes.json() as { access_token: string; refresh_token?: string };
    
    config.accessToken = tokenData.access_token;
    if (tokenData.refresh_token) {
      config.refreshToken = tokenData.refresh_token;
    }

    // Now, let's create a fresh Google Sheet for Registrations!
    const sheetRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: 'AIC 2026 Conference Registrations'
        },
        sheets: [
          {
            properties: {
              title: 'Registrations'
            },
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
      const sheetData = await sheetRes.json() as { spreadsheetId: string; spreadsheetUrl: string };
      config.spreadsheetId = sheetData.spreadsheetId;
      config.spreadsheetUrl = sheetData.spreadsheetUrl;
    } else {
      console.error('Failed to create sheet automatically', await sheetRes.text());
    }

    writeConfig(config);
    // Redirect back to main page with query param
    res.redirect('/?connected=true');
  } catch (err) {
    res.status(500).send(`Server Error during callback: ${err}`);
  }
});

// 5. Disconnect current Google Sheets integration
app.post('/api/google/disconnect', (req, res) => {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.unlinkSync(CONFIG_PATH);
  }
  res.json({ success: true });
});

// 6. Submit a Registration (write to Google Sheet and local array)
app.post('/api/register', async (req, res) => {
  const reg = req.body;
  if (!reg || !reg.attendee?.fullName) {
    res.status(400).json({ error: 'Invalid registration payload' });
    return;
  }

  // A. Save locally for fallback backup
  let localRegs = [];
  if (fs.existsSync(REGISTRATIONS_PATH)) {
    try {
      localRegs = JSON.parse(fs.readFileSync(REGISTRATIONS_PATH, 'utf-8'));
    } catch {
      localRegs = [];
    }
  }
  localRegs.push(reg);
  fs.writeFileSync(REGISTRATIONS_PATH, JSON.stringify(localRegs, null, 2), 'utf-8');

  // B. Try appending to Google Sheets
  const config = readConfig();
  if (config.refreshToken && config.spreadsheetId) {
    try {
      const token = await getFreshAccessToken(config);
      
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: 'Registrations!A:R',
          majorDimension: 'ROWS',
          values: [rowValues]
        })
      });

      if (!appendRes.ok) {
        console.error('Failed to append to spreadsheet', await appendRes.text());
        res.json({ success: true, warning: 'Saved locally, but failed to sync to Google Sheet' });
        return;
      }

      res.json({ success: true, synced: true });
    } catch (e: any) {
      console.error('Failed to write to Google Sheets securely: ', e.message);
      res.json({ success: true, warning: 'Saved locally, Google Sheet write timed out/failed' });
    }
  } else {
    res.json({ success: true, synced: false, warning: 'Saved locally. Google Sheet is not connected.' });
  }
});

// 7. Contact Message Email Sync
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const { data, error } = await resend.emails.send({
      from: `AIC Website <${senderEmail}>`,
      to: ['lukas@heartforthecity.co.uk'],
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
      `,
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Email submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// START EXPRESS/VITE ENGINE
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite development server connected in middleware mode.');
    } catch (err) {
      console.error('CRITICAL: Failed to initialize Vite development server:', err);
      process.exit(1);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
