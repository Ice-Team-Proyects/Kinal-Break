const { getDefaultConfig } = require('expo/metro-config');
const { execSync } = require('child_process');

try {
  execSync('python C:\\Users\\corre\\.gemini\\antigravity-ide\\brain\\171b7c97-ebbb-4e35-80ac-7936b29ce349\\scratch\\generate_kinal_logo.py');
} catch (e) {
  console.warn('Logo generator notice:', e.message);
}

const config = getDefaultConfig(__dirname);

module.exports = config;


