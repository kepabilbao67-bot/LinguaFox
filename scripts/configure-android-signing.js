const fs = require('fs');
const path = require('path');
const { modifyAppBuildGradle } = require('../plugins/with-release-signing');

const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

if (!fs.existsSync(buildGradlePath)) {
  console.error(`❌ ERROR: ${buildGradlePath} does not exist. Run expo prebuild first.`);
  process.exit(1);
}

let content = fs.readFileSync(buildGradlePath, 'utf8');
const originalContent = content;

content = modifyAppBuildGradle(content);

if (content !== originalContent) {
  fs.writeFileSync(buildGradlePath, content, 'utf8');
  console.log('✅ android/app/build.gradle updated with release signing configuration.');
} else {
  console.log('ℹ️ android/app/build.gradle already contains release signing configuration.');
}

// Verification checks
const verifiedContent = fs.readFileSync(buildGradlePath, 'utf8');
const hasReleaseSigningConfig = verifiedContent.includes('ANDROID_KEYSTORE_PASSWORD') || verifiedContent.includes('KEYSTORE_PASSWORD');
const hasReleaseBuildTypeSigning = verifiedContent.includes('signingConfig signingConfigs.release');

if (!hasReleaseSigningConfig) {
  console.error('❌ ERROR: signingConfigs.release missing in android/app/build.gradle');
  process.exit(1);
}

if (!hasReleaseBuildTypeSigning) {
  console.error('❌ ERROR: buildTypes.release is NOT using signingConfigs.release');
  process.exit(1);
}

console.log('✅ Verification passed: android/app/build.gradle is properly configured for Release signing.');
