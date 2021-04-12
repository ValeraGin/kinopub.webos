const { Packager } = require('@webosose/ares-cli/lib/package');
const path = require('path');
const fs = require('fs');
const util = require('util');
const pkg = require('../package.json');

const copyFile = util.promisify(fs.copyFile);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const rename = util.promisify(fs.rename);

const APP_IDS = [pkg.name, 'netflix', 'amazon', 'ivi', 'youtube'];

const buildDir = path.resolve(process.cwd(), 'build');
const outDir = path.resolve(process.cwd(), 'out');

const appInfoName = 'appinfo.json';
const appInfoBackupName = 'appinfo_bkp.json';

const appInfoPath = path.resolve(buildDir, appInfoName);
const appInfoBackupPath = path.resolve(buildDir, appInfoBackupName);

async function generatePackage(appIdIndex = 0) {
  const appId = APP_IDS[appIdIndex];

  if (appId) {
    const appInfoText = await readFile(appInfoBackupPath, 'utf8');
    const appInfo = JSON.parse(appInfoText);

    await writeFile(
      appInfoPath,
      JSON.stringify(
        {
          ...appInfo,
          id: appId,
        },
        null,
        4,
      ),
    );

    const options = {
      minify: false,
      excludefiles: [appInfoBackupName],
    };

    return new Promise((resolve, reject) => {
      const packager = new Packager(options);

      packager.generatePackage([buildDir], outDir, options, async (err) => {
        if (err) {
          console.error(error);
          reject(error);
          return;
        }

        await rename(
          path.resolve(outDir, packager.ipkFileName),
          path.resolve(outDir, `${pkg.name}_v${pkg.version}${appId === pkg.name ? '' : `_${appId}`}.ipk`),
        );

        await generatePackage(appIdIndex + 1);

        resolve();
      });
    });
  }
}

(async () => {
  await copyFile(appInfoPath, appInfoBackupPath);

  await generatePackage();

  await rename(appInfoBackupPath, appInfoPath);
})();
