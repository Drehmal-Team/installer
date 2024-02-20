const fs = require('fs');
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { downloadFile } from './DownloadFile';
const path = require('path');

export async function installShaders() {
  const { drehmalDir, shaders: enableShaders } = storeToRefs(
    useInstallerStore()
  );
  const { shaders } = storeToRefs(useSourcesStore());

  const shadersDir = path.join(drehmalDir.value, 'shaderpacks');
  const shadersName =
    shaders.value.name + ' v' + shaders.value.version + '.zip';

  // If user has selected shaders, then download them
  if (enableShaders.value) {
    console.log(`Downloading shaders to "${shadersDir}"`);

    if (!fs.existsSync(shadersDir))
      fs.mkdirSync(shadersDir, { recursive: true });
    await downloadFile(
      shaders.value.source,
      path.join(shadersDir, shadersName)
    );

    const shadersConfigPath = path.join(shadersDir, `${shadersName}.txt`);
    const shadersConfigValues = ['Crossprocess=true', 'sunPathRotation=-0.15f'];
    console.log(`Writing shaders.txt to "${shadersConfigPath}"`);
    fs.writeFileSync(shadersConfigPath, shadersConfigValues.join('\n'));
  }

  // Even if shaders aren't selected, configure Iris shaders but in the case of no, then mark as disabled
  // This allows someone to rerun the installer to disable shaders
  const irisConfigPath = path.join(
    drehmalDir.value,
    'config',
    'iris.properties'
  );
  const irisConfigValues = [
    'disableUpdateMessage=false',
    'enableDebugOptions=false',
    'maxShadowRenderDistance=32',
    `shaderPack=${shadersName}`,
    `enableShaders=${enableShaders.value ? 'true' : 'false'}`,
  ];

  console.log(`Writing iris.properties to "${irisConfigPath}"`);
  fs.writeFileSync(irisConfigPath, irisConfigValues.join('\n'));

  return;
}
