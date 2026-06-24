// Vercel Serverless Function for GitHub OAuth Token Exchange
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  // Get credentials from environment variables
  const clientId = process.env.VITE_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing GitHub OAuth credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub OAuth Error:', tokenData);
      return res.status(400).json(tokenData);
    }

    // Get user data with access token
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'User-Agent': 'Pomo-App',
        'Accept': 'application/json'
      }
    });

    const userData = await userResponse.json();

    // Return user data to client
    return res.status(200).json(userData);

  } catch (error) {
    console.error('GitHub OAuth Exception:', error);
    return res.status(500).json({ 
      error: 'Authentication failed', 
      message: error.message 
    });
  }
}
