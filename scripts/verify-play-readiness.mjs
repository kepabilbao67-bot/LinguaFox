#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   LINGUAFOX — VERIFICACIÓN DE PREPARACIÓN PLAY     ');
console.log('====================================================\n');

let allPassed = true;

function check(label, condition, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${label} ${details ? `(${details})` : ''}`);
  } else {
    console.log(`❌ [FAIL] ${label} ${details ? `(${details})` : ''}`);
    allPassed = false;
  }
}

// 1. App.json configuration
try {
  const appJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'app.json'), 'utf-8'));
  const pkg = appJson.expo?.android?.package;
  check('Package Identifier', pkg === 'com.kepabilbao.linguafox', `Encontrado: ${pkg}`);
  const version = appJson.expo?.version;
  check('App Version', version === '1.0.0', `Encontrado: ${version}`);
} catch (e) {
  check('Lectura app.json', false, e.message);
}

// 2. ADI Registration Token
try {
  const tokenPath = path.join(projectRoot, 'assets', 'adi-registration.properties');
  if (fs.existsSync(tokenPath)) {
    const token = fs.readFileSync(tokenPath, 'utf-8');
    const isValid = token === 'DE2AR72ZPM43OAAAAAAAAAAAAA';
    check('Token ADI Google', isValid, `Longitud: ${token.length} chars / esperado 26`);
  } else {
    check('Token ADI Google', false, 'Archivo no encontrado');
  }
} catch (e) {
  check('Token ADI Google', false, e.message);
}

// 3. Graphic Assets
function getPngDimensions(file) {
  try {
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    return { w, h };
  } catch (e) {
    return null;
  }
}

const iconPath = path.join(projectRoot, 'assets', 'store', 'google-play', 'icon-play-512.png');
const iconDim = getPngDimensions(iconPath);
check('Icono 512x512', iconDim && iconDim.w === 512 && iconDim.h === 512, iconDim ? `${iconDim.w}x${iconDim.h}` : 'No encontrado');

const bannerPath = path.join(projectRoot, 'assets', 'store', 'google-play', 'feature-graphic-1024x500.png');
const bannerDim = getPngDimensions(bannerPath);
check('Feature Graphic 1024x500', bannerDim && bannerDim.w === 1024 && bannerDim.h === 500, bannerDim ? `${bannerDim.w}x${bannerDim.h}` : 'No encontrado');

// 4. Production AAB
const aabPath = 'C:\\Users\\foca-\\Downloads\\LinguaFox-production-v1.0.0.aab';
if (fs.existsSync(aabPath)) {
  const stat = fs.statSync(aabPath);
  check('AAB de Producción Local', stat.size > 10000000, `${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
} else {
  check('AAB de Producción Local', false, `No encontrado en ${aabPath}`);
}

// 5. Public Privacy Policy URL
try {
  const res = await fetch('https://kepabilbao67-bot.github.io/LinguaFox/privacy.html');
  check('URL Pública de Privacidad', res.status === 200, `HTTP ${res.status}`);
} catch (e) {
  check('URL Pública de Privacidad', false, e.message);
}

// 6. Play Documentation Files
const requiredDocs = [
  'store-listing-final-es.md',
  'privacy-review-final.md',
  'data-safety-final-es.md',
  'app-content-final-es.md',
  'content-rating-final-es.md',
  'target-audience-final-es.md',
  'app-access-final-es.md',
  'assets-final-checklist.md',
  'release-notes-final-es.md',
  'closed-testing-plan-es.md',
  'PLAY-CONSOLE-MASTER-CHECKLIST.md'
];

let docsFound = 0;
for (const doc of requiredDocs) {
  const docPath = path.join(projectRoot, 'docs', 'google-play', doc);
  if (fs.existsSync(docPath)) {
    docsFound++;
  } else {
    console.log(`   ⚠️ Falta documento: ${doc}`);
  }
}
check('Documentación de Google Play', docsFound === requiredDocs.length, `${docsFound}/${requiredDocs.length} documentos listos`);

console.log('\n----------------------------------------------------');
if (allPassed) {
  console.log('🎉 RESULTADO: TODOS LOS REQUISITOS VERIFICADOS CON ÉXITO');
} else {
  console.log('⚠️ RESULTADO: SE ENCONTRARON ELEMENTOS PENDIENTES');
}
console.log('----------------------------------------------------\n');
