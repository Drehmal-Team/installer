import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { useStateStore } from 'src/stores/StateStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
import { getOldDirName } from './GetOldDirName';
import { installShaders } from './InstallShaders';
const fs = require('fs');
const path = require('path');

export async function downloadMods(ref: Ref) {
  const startTime = Date.now();

  const { launcher, shaders } = storeToRefs(useSourcesStore());
  const { drehmalDir, shaders: enableShaders } = storeToRefs(
    useInstallerStore()
  );
  const { processingMods, installType } = storeToRefs(useStateStore());

  const modList = launcher.value.modList;
  const modLoader = launcher.value.fabric.name;
  const totalMods = modList.length;
  // +2 for cit and shaders, +1 for cit if shaders are not enabled
  const progressBar = totalMods + (enableShaders.value ? 2 : 1);
  let completed = 0;

  const modsPath = path.join(drehmalDir.value, 'mods');

  if (fs.existsSync(modsPath)) {
    console.log(`Mods folder exists, moving to "${getOldDirName(modsPath)}"`);
    fs.renameSync(modsPath, getOldDirName(modsPath));
  }
  if (!fs.existsSync(modsPath)) fs.mkdirSync(modsPath, { recursive: true });

  async function processArray(mods: typeof modList): Promise<void> {
    for (const mod of mods) {
      const { name, mod_version, mc_version, source } = mod;
      const modName =
        name + ' - ' + modLoader + mod_version + '-' + mc_version + '.jar';
      console.log(`Downloading "${modName}" to "${modsPath}"`);
      const modPath = path.join(modsPath, modName);
      await downloadFile(source, modPath);
      completed++;
      const progress = completed / progressBar;
      const percent = (progress * 100).toFixed(1);

      ref.value.progress = progress;
      ref.value.percent = percent;
      // Note: Roughly 21 character limit, consider truncating mod name
      // if singleplayer install, trunc mod name
      // Downloading: Reese's Sodium Options
      const labelStr = `Downloading: ${name}`;
      if (installType.value === 'singleplayer' && labelStr.length > 30)
        ref.value.label = labelStr.slice(0, 30) + '...';
      else ref.value.label = labelStr;
      const taken = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(
        `Downloaded mod ${completed}/${totalMods} (${taken}s elapsed)`
      );
    }
  }
  await processArray(modList);

  ref.value.label = 'Configuring mods';

  const configPath = path.join(drehmalDir.value, 'config');
  if (!fs.existsSync(configPath)) fs.mkdirSync(configPath, { recursive: true });
  console.log(`Creating CIT config file in "${configPath}"`);
  const citJsonConfig = {
    enabled: true,
    mute_errors: false,
    mute_warns: false,
    citenchantment_scroll_multiplier: 8.0,
    cache_ms: 50,
    broken_paths: false,
  };
  fs.writeFileSync(
    path.join(configPath, 'citresewn.json'),
    JSON.stringify(citJsonConfig),
    'utf-8'
  );
  completed++;

  ref.value.progress = completed / progressBar;
  ref.value.percent = (ref.value.progress * 100).toFixed(1);

  if (!enableShaders.value) {
    console.log(
      'Shaders not selected, skipping installation, but configuring iris.properties'
    );
    await installShaders();
    ref.value.label = 'Mods successfully downloaded!';
  } else if (enableShaders.value) {
    console.log('Shaders selected, proceeding to install...');
    ref.value.label = `Downloading: ${shaders.value.name}`;
    await installShaders();
    completed++;
    ref.value.progress = completed / progressBar;
    ref.value.percent = (ref.value.progress * 100).toFixed(1);
    ref.value.label = 'Mods and shaders successfully downloaded!';
  }

  ref.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAACqElEQVRYhdVYzY7SUBT+Tu1CTWRaG4UncKMOxOWMhhg37khYwBgT43P4ADyIiSawMLBzA0LUWRLGv4VPwMwECjVhiJYeF6W1pTBD7+2Mw7e67b0993733HvOd0r1ahuFUh6NWoexgSiU8tSodUDMjEatw0QETb/2v9cVCyPzBMyMQilPVK+2GQAUhbClbRaR8egEjuMeJBUA9JvX/U7DSElP8OJp59T+1+/z0nMMBpa/8eZw4hLx4JG4mlKjX8ZALqOv7Ov1TWn7U8uGYaQwGFj+u4hFkUnKO02/zQBq+09OHb+324LDDFpz/LI1Ti079E4FxbKxFPfSGq6Qa+jn8NeZ47fTmt/u9U35BRCgkgST8m4TzPF39NW7B6HnZw9bmDkc244HAqC4zhVDNq1DIXmX3r+tQVXk7Ciyi0jgZCYCKSIOMxTJnfRAkp4VioOVYhffjsZ4++mx0KSlQJQjANX53agUu+j1TaG7IhzQbccR/TSUZw4OE4haIHEiIijvtsDMyGV0KY9GwRdLJBvIHw4nK7YTIbI332lvaYtnPOiJ78djvPmYlCf+IREiwUz95XAU6c+mNZ/kzDmfsicRIl6mrhS72E5roagEuES/Ho1Q/SyWudeBMBFVWZ2CglGJ4YZYGSm0DqhebbNXjxhGKpb6fZnvYPLHjtyJSrHrtw/6pp8nVqG00wQRYnlsatm+jDeHE7nMfse4kYjWymV0Xz2L4lzC76K6vQjIi8ZLohqlPOLtvFeXeDhLKy1GNdE6JIhEjlY2HdBOa1R8yWutJUSmlh27bl+8E88ffcDM4YgMUYjgsHglGFzjIkIrHgwsGEZq6cA4uHtra+n737MZfhxb0vYBhP6gAPM84j0E/29tAszhxG8ruDzVqgzIO1oEgIMMNwgEAH8Bhif2yStQayoAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
  processingMods.value = false;
}
