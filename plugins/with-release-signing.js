const { withAppBuildGradle } = require('@expo/config-plugins');

function modifyAppBuildGradle(buildGradle) {
  let content = buildGradle;

  const releaseSigningConfig = `        release {
            def keystorePath = System.getenv("ANDROID_KEYSTORE_PATH") ?: System.getenv("KEYSTORE_FILE") ?: "release.keystore"
            storeFile file(keystorePath)
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD") ?: System.getenv("KEYSTORE_PASSWORD") ?: ""
            keyAlias System.getenv("ANDROID_KEY_ALIAS") ?: System.getenv("KEY_ALIAS") ?: ""
            keyPassword System.getenv("ANDROID_KEY_PASSWORD") ?: System.getenv("KEY_PASSWORD") ?: ""
        }
`;

  // Helper to find block end index using brace counting
  function findBlockEnd(str, startIndex) {
    let depth = 0;
    for (let i = startIndex; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  // 1. Target signingConfigs block
  const signingConfigsIndex = content.indexOf('signingConfigs {');
  if (signingConfigsIndex !== -1) {
    const signingConfigsEnd = findBlockEnd(content, signingConfigsIndex);
    if (signingConfigsEnd !== -1) {
      let scBody = content.substring(signingConfigsIndex, signingConfigsEnd);
      // Remove any existing release block inside signingConfigs
      scBody = scBody.replace(/release\s*\{[\s\S]*?\n\s*\}/g, '').trimEnd();
      scBody = scBody + '\n' + releaseSigningConfig + '    ';
      content = content.substring(0, signingConfigsIndex) + scBody + content.substring(signingConfigsEnd);
    }
  }

  // 2. Target buildTypes block, and specifically the release { ... } block inside it
  const buildTypesIndex = content.indexOf('buildTypes {');
  if (buildTypesIndex !== -1) {
    const buildTypesEnd = findBlockEnd(content, buildTypesIndex);
    if (buildTypesEnd !== -1) {
      let btBody = content.substring(buildTypesIndex, buildTypesEnd);
      const relIdx = btBody.search(/release\s*\{/);
      if (relIdx !== -1) {
        const relEnd = findBlockEnd(btBody, relIdx);
        if (relEnd !== -1) {
          let relBody = btBody.substring(relIdx, relEnd);
          if (relBody.includes('signingConfig signingConfigs.debug')) {
            relBody = relBody.replace('signingConfig signingConfigs.debug', 'signingConfig signingConfigs.release');
          } else if (!relBody.includes('signingConfig signingConfigs.release')) {
            relBody = relBody.replace(/(release\s*\{)/, '$1\n            signingConfig signingConfigs.release');
          }
          btBody = btBody.substring(0, relIdx) + relBody + btBody.substring(relEnd);
        }
      }
      content = content.substring(0, buildTypesIndex) + btBody + content.substring(buildTypesEnd);
    }
  }

  return content;
}

const withReleaseSigning = (config) => {
  return withAppBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language === 'groovy') {
      modConfig.modResults.contents = modifyAppBuildGradle(modConfig.modResults.contents);
    }
    return modConfig;
  });
};

module.exports = withReleaseSigning;
module.exports.modifyAppBuildGradle = modifyAppBuildGradle;
