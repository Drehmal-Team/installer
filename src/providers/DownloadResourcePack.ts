import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { useStateStore } from 'src/stores/StateStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
import { updateMinecraftOpts } from './UpdateMinecraftOpts';
const path = require('path');
const fs = require('fs');

export async function downloadResourcePack(ref: Ref) {
  const { resourcePack } = storeToRefs(useSourcesStore());
  const { drehmalDir, minecraftDir } = storeToRefs(useInstallerStore());
  const { processingResourcepack } = storeToRefs(useStateStore());
  ref.value.label = 'Downloading resource pack';

  // NOTE: if changing this, edit the value in src/providers/UpdateMinecraftOpts.ts
  const rpName = `Drehmal Resource Pack v${resourcePack.value.version}.zip`;
  // ensure the resourcepacks folder exists first (should be caught by the profile file validation, but just in case)
  const rpFolder = path.join(drehmalDir.value, 'resourcepacks');
  if (!fs.existsSync(rpFolder)) fs.mkdirSync(rpFolder, { recursive: true });

  const filePath = path.join(drehmalDir.value, 'resourcepacks', rpName);
  console.log(`Downloading resource pack to: "${filePath}"`);

  const startTime = Date.now();
  downloadFile(resourcePack.value.source, filePath, ref).then(() => {
    const taken = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Resource pack downloaded (${taken}s total)`);
    ref.value.label = 'Updating video settings';

    const optionsFilePath = path.join(drehmalDir.value, 'options.txt');
    const oldOpts = path.join(minecraftDir.value, 'options.txt');

    console.log(`Updating Minecraft options in file: ${optionsFilePath}`);
    updateMinecraftOpts(optionsFilePath, oldOpts);

    ref.value.label = 'Resource pack downloaded!';

    console.log('Updated Resource Pack order and video settings');
    processingResourcepack.value = false;
  });
}
