import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const STRAVA_CLIENT_ID = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID || '';
const STRAVA_CLIENT_SECRET = process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET || '';
const STRAVA_REDIRECT_URI = AuthSession.makeRedirectUri({
});

if (!STRAVA_CLIENT_ID || !STRAVA_REDIRECT_URI || !STRAVA_CLIENT_SECRET) {
  throw new Error('Missing Strava environment variables');
}

export async function authenticateWithStrava(): Promise<any> {
  const discovery = {
    authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
    tokenEndpoint: 'https://www.strava.com/oauth/token',
  };

  const request = new AuthSession.AuthRequest({
    clientId: STRAVA_CLIENT_ID,
    redirectUri: STRAVA_REDIRECT_URI,
    scopes: ['read', 'activity:read_all'],
    extraParams: {
      approval_prompt: 'auto',
      response_type: 'code',
    },
  });

  const result = await request.promptAsync(discovery);

  if (result.type === 'success' && result.params.code) {
    return exchangeToken(result.params.code);
  }

  throw new Error('Authentication failed or was canceled by the user');
}

async function exchangeToken(code: string): Promise<any> {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: STRAVA_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error('Token exchange failed');
  }

  return response.json();
}
