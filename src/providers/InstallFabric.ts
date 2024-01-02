import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
const { spawn } = require('child_process');
// import { exec, spawn, spawnSync } from 'child_process';
const fs = require('fs');
// const https = require('https');
const path = require('path');
const os = require('os');

export async function installFabric(ref: Ref) {
  const startTime = Date.now();
  // const sourcesStore = useSourcesStore()
  // const installerStore = useInstallerStore();

  const { map, mods, resourcePack } = storeToRefs(useSourcesStore());
  const {
    homeDir,
    appDir,
    memory,
    minecraftDir,
    minecraftDirIsDefault,
    shardsDir,
  } = storeToRefs(useInstallerStore());

  const fabricSource = mods.value.fabric.source;

  // const homeDir = installerStore.homeDir
  const defaultMinecraftPath = path.join(homeDir.value, '.minecraft');
  const fabricPath = path.join(
    homeDir.value,
    'Drehmal Installer',
    'fabric-installer.jar'
  );

  console.log(`Downloading Fabric installer to ${fabricPath}`);

  ref.value.label = 'Downloading Fabric installer';
  ref.value.progress = 0.33;
  ref.value.percent = 50;
  downloadFile(fabricSource, fabricPath).then(() => {
    ref.value.label = 'Installing Fabric';
    ref.value.progress = 0.67;
    ref.value.percent = 67;
    console.log('Calling Fabric installer');
    const fabricProc = spawn('java', [
      '-jar',
      fabricPath,
      'client',
      '-dir',
      defaultMinecraftPath,
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
      console.log(`child process exited with code ${code} in ${taken}ms`);
      ref.value.label = 'Fabric successfully installed!';
      ref.value.progress = 1;
      ref.value.percent = 100;
      ref.value.img = 'src/assets/small-complete-button.png';
    });
  });
}
// java -jar "C:\Users\jonat\AppData\Roaming\Drehmal Installer\fabric-installer.jar" client -dir "C:\Users\jonat\AppData\Roaming\.minecraft" -mcversion 1.17.1
export async function downloadMods(ref: Ref) {
  const startTime = Date.now();

  const { map, mods, resourcePack } = storeToRefs(useSourcesStore());
  const {
    homeDir,
    appDir,
    memory,
    minecraftDir,
    minecraftDirIsDefault,
    shardsDir,
  } = storeToRefs(useInstallerStore());

  const modSources = mods.value.modLists.all;
  const totalMods = modSources.length;
  let downloaded = 0;

  const modsPath = path.join(minecraftDir.value, 'mods');
  if (!fs.existsSync(modsPath)) fs.mkdirSync(modsPath, { recursive: true });

  async function processArray(mods: string[]): Promise<void> {
    for (const mod of mods) {
      const modName = mod.split('/').pop();
      console.log(`trying ${modName}`);
      const modPath = path.join(modsPath, modName);
      await downloadFile(mod, modPath);
      downloaded++;
      const progress = downloaded / totalMods;
      const percent = (progress * 100).toFixed(1);

      ref.value.progress = progress;
      ref.value.percent = percent;

      ref.value.label = `Downloading: ${percent}% - (Mod ${downloaded}/${totalMods})`;

      const taken = Date.now() - startTime;
      console.log(`downloaded mod ${downloaded}/${totalMods} in ${taken}ms`);
    }
  }
  await processArray(modSources);
  ref.value.label = 'Mods successfully downloaded!';
  ref.value.img = 'src/assets/small-complete-button.png';
}
