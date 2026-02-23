const fs = require('fs');
const path = require('path');

// Load environment variables from .env files
const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    require('dotenv').config({ path: filePath });
  }
}

// Now run the actual build command
const { execSync } = require('child_process');
const cmd = 'keystone build --no-ui && npm run migrate && next build';
execSync(cmd, { stdio: 'inherit' });
