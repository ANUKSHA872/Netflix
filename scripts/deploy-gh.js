import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const envPath = path.join(root, 'frontend', '.env.gh');

let apiUrl = process.env.VITE_API_URL;
if (!apiUrl && existsSync(envPath)) {
  try {
    const content = readFileSync(envPath, 'utf8');
    const match = content.match(/VITE_API_URL=(.+)/);
    if (match) apiUrl = match[1].trim().replace(/^["']|["']$/g, '');
  } catch (_) {}
}

if (!apiUrl) {
  console.error('\n  GitHub Pages needs the API URL. Choose one:\n');
  console.error('  1. Create frontend/.env.gh with:');
  console.error('     VITE_API_URL=https://your-vercel-app.vercel.app\n');
  console.error('  2. Or run: VITE_API_URL=https://your-app.vercel.app npm run deploy:api\n');
  console.error('  Get your Vercel URL from: vercel.com → Your Project → Domains\n');
  process.exit(1);
}

console.log('  Using API:', apiUrl, '\n');
process.env.VITE_API_URL = apiUrl;
execSync('npm run deploy', { cwd: root, stdio: 'inherit', env: { ...process.env, VITE_API_URL: apiUrl } });
