import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
import { useStateStore } from 'src/stores/StateStore';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

export async function installFabric(ref: Ref) {
  const startTime = Date.now();

  const { launcher, map } = storeToRefs(useSourcesStore());
  const { homeDir, minecraftDir, memory } = storeToRefs(useInstallerStore());
  const { processingFabric } = storeToRefs(useStateStore());

  const fabricPath = path.join(
    homeDir.value,
    'Drehmal Installer',
    'fabric-installer-' + launcher.value.fabric.version + '.jar'
  );

  console.log(`Downloading Fabric installer to ${fabricPath}`);

  ref.value.label = 'Downloading Fabric installer';
  ref.value.progress = 0.25;
  ref.value.percent = 25;
  downloadFile(launcher.value.fabric.source, fabricPath).then(() => {
    ref.value.label = 'Installing Fabric';
    ref.value.progress = 0.5;
    ref.value.percent = 50;
    console.log('Calling Fabric installer');
    // TODO: check if user has java installed, popup if fail
    const fabricProc = spawn('java', [
      '-jar',
      fabricPath,
      'client',
      '-dir',
      minecraftDir.value,
      '-mcversion',
      '1.17.1',
    ]);
    fabricProc.stdout.on('data', (data: any) => {
      console.log(`stdout: ${data}`);
    });
    fabricProc.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data}`);
    });

    fabricProc.on('close', (code: any) => {
      const taken = Date.now() - startTime;
      console.log(`Fabric process exited with code ${code} in ${taken}ms`);
      fs.unlinkSync(fabricPath);

      ref.value.label = 'Fabric successfully installed!';
      ref.value.progress = 0.67;
      ref.value.percent = 67;

      const profileFilePath = path.join(
        minecraftDir.value,
        'launcher_profiles.json'
      );

      // TODO: edit fabric launcher profile
      console.log(`Updating installer profiles file at: ${profileFilePath}`);
      const data = JSON.parse(
        fs.readFileSync(profileFilePath, 'utf-8') as string
      );

      data['profiles'][map.value.versionName] = JSON.parse(
        JSON.stringify(data['profiles']['fabric-loader-1.17.1'])
      );

      data['profiles'][map.value.versionName]['name'] = map.value.versionName;
      data['profiles'][map.value.versionName]['icon'] =
        launcher.value.launcher_icon; // in base64
      data['profiles'][map.value.versionName][
        'javaArgs'
      ] = `-Xmx${memory.value}G`;

      fs.writeFileSync(profileFilePath, JSON.stringify(data), 'utf-8');

      ref.value.label = 'Minecraft profile created!';
      ref.value.progress = 1;
      ref.value.percent = 100;
      ref.value.img =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAACqElEQVRYhdVYzY7SUBT+Tu1CTWRaG4UncKMOxOWMhhg37khYwBgT43P4ADyIiSawMLBzA0LUWRLGv4VPwMwECjVhiJYeF6W1pTBD7+2Mw7e67b0993733HvOd0r1ahuFUh6NWoexgSiU8tSodUDMjEatw0QETb/2v9cVCyPzBMyMQilPVK+2GQAUhbClbRaR8egEjuMeJBUA9JvX/U7DSElP8OJp59T+1+/z0nMMBpa/8eZw4hLx4JG4mlKjX8ZALqOv7Ov1TWn7U8uGYaQwGFj+u4hFkUnKO02/zQBq+09OHb+324LDDFpz/LI1Ti079E4FxbKxFPfSGq6Qa+jn8NeZ47fTmt/u9U35BRCgkgST8m4TzPF39NW7B6HnZw9bmDkc244HAqC4zhVDNq1DIXmX3r+tQVXk7Ciyi0jgZCYCKSIOMxTJnfRAkp4VioOVYhffjsZ4++mx0KSlQJQjANX53agUu+j1TaG7IhzQbccR/TSUZw4OE4haIHEiIijvtsDMyGV0KY9GwRdLJBvIHw4nK7YTIbI332lvaYtnPOiJ78djvPmYlCf+IREiwUz95XAU6c+mNZ/kzDmfsicRIl6mrhS72E5roagEuES/Ho1Q/SyWudeBMBFVWZ2CglGJ4YZYGSm0DqhebbNXjxhGKpb6fZnvYPLHjtyJSrHrtw/6pp8nVqG00wQRYnlsatm+jDeHE7nMfse4kYjWymV0Xz2L4lzC76K6vQjIi8ZLohqlPOLtvFeXeDhLKy1GNdE6JIhEjlY2HdBOa1R8yWutJUSmlh27bl+8E88ffcDM4YgMUYjgsHglGFzjIkIrHgwsGEZq6cA4uHtra+n737MZfhxb0vYBhP6gAPM84j0E/29tAszhxG8ruDzVqgzIO1oEgIMMNwgEAH8Bhif2yStQayoAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
      processingFabric.value = false;
    });
  });
}
export async function downloadMods(ref: Ref) {
  const startTime = Date.now();

  const { launcher } = storeToRefs(useSourcesStore());
  const { minecraftDir } = storeToRefs(useInstallerStore());
  const { processingMods } = storeToRefs(useStateStore());

  const modList = launcher.value.modList;
  const modLoader = launcher.value.fabric.name;
  const totalMods = modList.length;
  let downloaded = 0;

  const modsPath = path.join(minecraftDir.value, 'mods');
  if (!fs.existsSync(modsPath)) fs.mkdirSync(modsPath, { recursive: true });

  async function processArray(mods: typeof modList): Promise<void> {
    for (const mod of mods) {
      const { name, mod_version, mc_version, source } = mod;
      const modName =
        name + ' - ' + modLoader + mod_version + '-' + mc_version + '.jar';
      console.log(`Downloading ${modName} to ${modsPath}`);
      const modPath = path.join(modsPath, modName);
      await downloadFile(source, modPath);
      downloaded++;
      const progress = downloaded / totalMods;
      const percent = (progress * 100).toFixed(1);

      ref.value.progress = progress;
      ref.value.percent = percent;
      // Note: Roughly 21 character limit, consider truncating mod name
      ref.value.label = `Downloading: ${name}`;

      const taken = Date.now() - startTime;
      console.log(`downloaded mod ${downloaded}/${totalMods} in ${taken}ms`);
    }
  }
  await processArray(modList);
  ref.value.label = 'Mods successfully downloaded!';
  ref.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAACqElEQVRYhdVYzY7SUBT+Tu1CTWRaG4UncKMOxOWMhhg37khYwBgT43P4ADyIiSawMLBzA0LUWRLGv4VPwMwECjVhiJYeF6W1pTBD7+2Mw7e67b0993733HvOd0r1ahuFUh6NWoexgSiU8tSodUDMjEatw0QETb/2v9cVCyPzBMyMQilPVK+2GQAUhbClbRaR8egEjuMeJBUA9JvX/U7DSElP8OJp59T+1+/z0nMMBpa/8eZw4hLx4JG4mlKjX8ZALqOv7Ov1TWn7U8uGYaQwGFj+u4hFkUnKO02/zQBq+09OHb+324LDDFpz/LI1Ti079E4FxbKxFPfSGq6Qa+jn8NeZ47fTmt/u9U35BRCgkgST8m4TzPF39NW7B6HnZw9bmDkc244HAqC4zhVDNq1DIXmX3r+tQVXk7Ciyi0jgZCYCKSIOMxTJnfRAkp4VioOVYhffjsZ4++mx0KSlQJQjANX53agUu+j1TaG7IhzQbccR/TSUZw4OE4haIHEiIijvtsDMyGV0KY9GwRdLJBvIHw4nK7YTIbI332lvaYtnPOiJ78djvPmYlCf+IREiwUz95XAU6c+mNZ/kzDmfsicRIl6mrhS72E5roagEuES/Ho1Q/SyWudeBMBFVWZ2CglGJ4YZYGSm0DqhebbNXjxhGKpb6fZnvYPLHjtyJSrHrtw/6pp8nVqG00wQRYnlsatm+jDeHE7nMfse4kYjWymV0Xz2L4lzC76K6vQjIi8ZLohqlPOLtvFeXeDhLKy1GNdE6JIhEjlY2HdBOa1R8yWutJUSmlh27bl+8E88ffcDM4YgMUYjgsHglGFzjIkIrHgwsGEZq6cA4uHtra+n737MZfhxb0vYBhP6gAPM84j0E/29tAszhxG8ruDzVqgzIO1oEgIMMNwgEAH8Bhif2yStQayoAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
  processingMods.value = false;
}

export async function downloadResourcePack(ref: Ref) {
  const { resourcePack } = storeToRefs(useSourcesStore());
  const { minecraftDir } = storeToRefs(useInstallerStore());
  const { processingResourcepack } = storeToRefs(useStateStore());
  ref.value.label = 'Downloading resource pack';

  const rpName = `Drehmal Resource Pack v${resourcePack.value.version}.zip`;
  const filePath = path.join(minecraftDir.value, 'resourcepacks', rpName);
  console.log(`Downloading resource pack to: ${filePath}`);
  downloadFile(resourcePack.value.source, filePath, ref).then(() => {
    ref.value.label = 'Updating resource pack order';

    const optionsFilePath = path.join(minecraftDir.value, 'options.txt');
    const data = fs.readFileSync(optionsFilePath).toString().split('\n');
    const resourceOptIndex = data.findIndex(
      (item: string[]) => item.indexOf('resourcePacks:') !== -1
    );
    data[
      resourceOptIndex
    ] = `resourcePacks:["vanilla","Fabric Mods","file/${rpName}"]`;

    console.log(`Updating resource pack order in file: ${optionsFilePath}`);
    fs.writeFileSync(optionsFilePath, data.join('\n'), 'utf-8');
    ref.value.label = 'Resource pack downloaded!';

    console.log('Updated Resource Pack order');
    processingResourcepack.value = false;
  });
}
