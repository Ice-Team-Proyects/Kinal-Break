const fs = require('fs');
const path = require('path');

const src = 'C:\\cafeproyect\\Kinal-Break\\client-admin\\src\\assets\\Logo.png';
const targetDir = 'C:\\cafeproyect\\Kinal-Break\\client-user\\assets';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(src, path.join(targetDir, 'icon.png'));
fs.copyFileSync(src, path.join(targetDir, 'splash.png'));
fs.copyFileSync(src, path.join(targetDir, 'adaptive-icon.png'));

console.log('✅ Logo images copied successfully to client-user/assets!');
