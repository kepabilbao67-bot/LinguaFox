const { withDangerousMod, createRunOncePlugin } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TOKEN = 'DE2AR72ZPM43OAAAAAAAAAAAAA';

const withAdiRegistration = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const assetsDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'assets'
      );
      const targetFile = path.join(assetsDir, 'adi-registration.properties');

      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      const sourceFile = path.join(
        projectRoot,
        'assets',
        'adi-registration.properties'
      );

      let tokenContent = TOKEN;
      if (fs.existsSync(sourceFile)) {
        const fileContent = fs.readFileSync(sourceFile, 'utf-8').trim();
        if (fileContent) {
          tokenContent = fileContent;
        }
      }

      fs.writeFileSync(targetFile, tokenContent, 'utf-8');

      return config;
    },
  ]);
};

module.exports = createRunOncePlugin(
  withAdiRegistration,
  'withAdiRegistration',
  '1.0.0'
);
