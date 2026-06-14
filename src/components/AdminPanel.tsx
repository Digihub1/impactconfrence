import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, Key, CheckCircle, ExternalLink, Settings, RefreshCw, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GoogleStatus {
  connected: boolean;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  hasClientCredentials: boolean;
  clientId: string | null;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [status, setStatus] = useState<GoogleStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  // Fetch current Google Sheets status from backend
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/google-status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      } else {
        setErrorStatus('Failed to load connection status from the server.');
      }
    } catch (e) {
      console.error(e);
      setErrorStatus('Server is not responding. Please check server logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchStatus();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Authorization Submission
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'dallas2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect secret passcode. Try default "dallas2026"');
    }
  };

  // Begin Google OAuth redirect
  const handleConnect = async () => {
    try {
      const res = await fetch('/api/google-auth');
      if (res.ok) {
        const data = await res.json();
        if (data.authUrl) {
          // Redirect the user to Google OAuth consent
          window.location.href = data.authUrl;
        } else {
          alert('OAuth URL generation failed.');
        }
      } else {
        alert('Could not retrieve auth URL. Make sure client credentials are added in the secrets panel!');
      }
    } catch (e) {
      alert('OAuth request failed.');
    }
  };

  // Disconnect Google Sheets
  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect Google Sheets? Registrations will stop syncing to the Sheet.')) {
      try {
        const res = await fetch('/api/google-disconnect', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          fetchStatus();
        }
      } catch (e) {
        alert('Disconnection failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-8">
        
        {/* Passcode Shield Gate */}
        {!isAuthenticated ? (
          <div className="p-8 md:p-12 flex flex-col items-center justify-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-red-100 border border-red-200 text-red-600 flex items-center justify-center">
              <Key className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="text-center space-y-1.5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] font-mono">Secretariat Verification</h3>
              <p className="text-xs text-slate-550 max-w-sm mx-auto leading-relaxed">
                Secretariat access verification is mandatory for Google Sheet registry configuration.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block font-mono text-center mb-2">Secret Passcode *</label>
                <input
                  type="password"
                  placeholder="ENTER dallas2026 TO UNLOCK"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 transition text-center font-mono tracking-[0.2em] uppercase"
                />
                {authError && <p className="text-[10px] font-bold text-red-500 text-center mt-2">{authError}</p>}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-[10px] uppercase tracking-widest rounded-full cursor-pointer transition active:scale-97"
                >
                  Close Panel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-650 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase tracking-[0.25em] rounded-full cursor-pointer transition active:scale-97 shadow"
                >
                  Authorize
                </button>
              </div>
            </form>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[10px] text-slate-500 text-center max-w-sm leading-relaxed font-mono">
              <strong>Support Passcode:</strong> Use default peer key <code>dallas2026</code> to verify credentials.
            </div>
          </div>
        ) : (
          
          /* AUTHENTICATED PANEL VIEW */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-xs font-black text-slate-950 uppercase tracking-widest font-mono">Google Sheets Integration</h2>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Collaborators Live Sync</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition border border-slate-200"
              >
                Close Settings
              </button>
            </div>

            {/* Central content container */}
            <div className="p-6 overflow-y-auto space-y-6">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                  <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider font-mono">Syncing State...</span>
                </div>
              ) : errorStatus ? (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center text-xs font-medium">
                  {errorStatus}
                </div>
              ) : status ? (
                <div className="space-y-6">
                  {/* Status Indicator */}
                  <div className="p-5 rounded-2xl border flex items-start gap-4 shadow-sm bg-white border-slate-200">
                    {status.connected ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider font-mono block">Active Connection</span>
                          <h4 className="text-xs font-bold text-slate-900">Successfully synced registrations!</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                            All incoming registrants will be added in real-time as rows in your Google Sheets spreadsheet.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-yellow-50 border border-yellow-105 text-yellow-600 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-black text-yellow-600 uppercase tracking-wider font-mono block">Not Connected</span>
                          <h4 className="text-xs font-bold text-slate-900">Google Sheet integration is pending configuration.</h4>
                          <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">
                            Please click the connect button below to link your Google Sheets and automate registration logs for your collaborators.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Environment Credentials missing check */}
                  {!status.hasClientCredentials && (
                    <div className="p-4 bg-amber-50 border border-amber-200/60 text-amber-800 rounded-2xl text-xs space-y-1.5 font-medium leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Google Client Secrets Missing</span>
                      </div>
                      <p className="text-[11px] text-amber-700">
                        Please specify <strong>GOOGLE_CLIENT_ID</strong> and <strong>GOOGLE_CLIENT_SECRET</strong> inside the <strong>Secrets panel</strong> under applet Settings (AI Studio UI) to connect with Google.
                      </p>
                    </div>
                  )}

                  {/* Connected Sheet Details */}
                  {status.connected && status.spreadsheetUrl && (
                    <div className="p-5 bg-emerald-50/40 border border-emerald-100/80 rounded-2xl space-y-4">
                      <div>
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest font-mono">Spreadsheet Link</span>
                        <h4 className="text-xs font-extrabold text-slate-900 mt-1">AIC 2026 Conference Registrations</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 max-w-[280px] truncate">ID: {status.spreadsheetId}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={status.spreadsheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-black tracking-widest uppercase transition text-center select-none cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          View Google Sheet <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={handleDisconnect}
                          className="py-2.5 px-4 bg-slate-200/50 hover:bg-slate-202 text-red-600 rounded-full text-[10px] font-black tracking-widest uppercase transition cursor-pointer select-none flex items-center justify-center gap-1 border border-slate-250"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Connect Trigger Actions */}
                  {!status.connected && (
                    <button
                      onClick={handleConnect}
                      disabled={!status.hasClientCredentials}
                      className="w-full py-3 bg-red-650 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition cursor-pointer select-none flex items-center justify-center gap-1.5 shadow active:scale-97"
                    >
                      Connect Google Sheets <FileSpreadsheet className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between font-mono text-[9px] text-slate-500 tracking-wider">
              <span>Secure Session • Sep 2026</span>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-red-600 hover:underline font-extrabold flex items-center gap-1 cursor-pointer select-none border-none py-0.5"
              >
                Lock Portal <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
