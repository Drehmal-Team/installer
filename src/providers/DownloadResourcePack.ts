import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { useStateStore } from 'src/stores/StateStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
import { updateMinecraftOpts } from './UpdateMinecraftOpts';
const path = require('path');

export async function downloadResourcePack(ref: Ref) {
  const { resourcePack } = storeToRefs(useSourcesStore());
  const { minecraftDir } = storeToRefs(useInstallerStore());
  const { processingResourcepack } = storeToRefs(useStateStore());
  ref.value.label = 'Downloading resource pack';

  // NOTE: if changing this, edit the value in src/providers/UpdateMinecraftOpts.ts
  const rpName = `Drehmal Resource Pack v${resourcePack.value.version}.zip`;
  const filePath = path.join(minecraftDir.value, 'resourcepacks', rpName);
  console.log(`Downloading resource pack to: ${filePath}`);
  downloadFile(resourcePack.value.source, filePath, ref).then(() => {
    ref.value.label = 'Updating video settings';

    const optionsFilePath = path.join(minecraftDir.value, 'options.txt');

    console.log(`Updating Minecraft options in file: ${optionsFilePath}`);
    updateMinecraftOpts(optionsFilePath);

    ref.value.label = 'Resource pack downloaded!';

    console.log('Updated Resource Pack order and video settings');
    processingResourcepack.value = false;
  });
}
