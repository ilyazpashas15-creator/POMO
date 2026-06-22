import { defineConfig, loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), '');

export default defineConfig({
  server: {
    port: 5174,
  },
  plugins: [{
    name: 'auth-oauth',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        // Serve Google OAuth callback page at clean URL (/auth/google/callback)
        if (url.pathname === '/auth/google/callback') {
          const fs = await import('fs');
          const path = await import('path');
          const filePath = path.join(process.cwd(), 'public', 'auth', 'google', 'callback.html');
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'text/html');
            res.end(content);
          } catch {
            res.statusCode = 404;
            res.end('Not found');
          }
          return;
        }

        if (url.pathname === '/api/github/token') {
          const code = url.searchParams.get('code');

          res.setHeader('Content-Type', 'application/json');

          if (!code) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'No code provided' }));
            return;
          }

          try {
            console.log('GitHub OAuth Debug:');
            console.log('Client ID:', env.VITE_GITHUB_CLIENT_ID);
            console.log('Client Secret:', env.GITHUB_CLIENT_SECRET ? 'Present' : 'Missing');
            console.log('Authorization Code:', code);
            
            const response = await fetch('https://github.com/login/oauth/access_token', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                client_id: env.VITE_GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_CLIENT_SECRET,
                code: code
              })
            });

            const data = await response.json();
            console.log('GitHub OAuth Response:', data);

            if (data.error) {
              console.error('GitHub OAuth Error:', data);
              res.statusCode = 400;
              res.end(JSON.stringify(data));
              return;
            }

            const userResponse = await fetch('https://api.github.com/user', {
              headers: {
                'Authorization': `token ${data.access_token}`,
                'User-Agent': 'Pomo-App'
              }
            });

            const userData = await userResponse.json();
            res.end(JSON.stringify(userData));
          } catch (err) {
            console.error('Proxy Exception:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Proxy Exception', message: err.message }));
          }
          return;
        }
        next();
      });
    }
  }]
});
