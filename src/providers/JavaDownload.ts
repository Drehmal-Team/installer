/* eslint-disable @typescript-eslint/no-explicit-any */
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { downloadFile } from './DownloadFile';
import { Ref } from 'vue';

const extract = require('extract-zip');
const { ipcRenderer } = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs');
const tar = require('tar');

/*
Helpful resources used to decide:
https://github.com/brucethemoose/Minecraft-Performance-Flags-Benchmarks
https://whichjdk.com/
*/

// https://api.adoptium.net/q/swagger-ui/#/Binary
// /v3/binary/latest/{feature_version}/{release_type}/{os}/{arch}/{image_type}/{jvm_impl}/{heap_size}/{vendor}
// https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jre/hotspot/normal/eclipse?project=jdk

export async function getJre(ref: Ref): Promise<string> {
  const osMap: { [key: string]: string } = {
    win32: 'windows',
    darwin: 'mac',
    linux: 'linux',
    // TODO: handle other platforms?
  };
  const { javaExePath: javaStorePath, javawExePath: javawStorePath } =
    storeToRefs(useInstallerStore());

  const platform: NodeJS.Platform = await ipcRenderer.invoke('getPlatform');
  // const platform: NodeJS.Platform = 'linux';

  const getMacArch = () => {
    const arch = os.arch();

    if (arch === 'x64') {
      return 'x64';
    } else if (arch === 'arm64') {
      return 'aarch64';
    }

    return arch;
  };

  const flags = {
    // https://api.adoptium.net/q/swagger-ui/#/Binary/getBinary
    // /v3/binary/latest/{feature_version}/{release_type}/{os}/{arch}/{image_type}/{jvm_impl}/{heap_size}/{vendor}
    feature_version: '17', // Drehmal is 1.17+, so use JRE 17
    release_type: 'ga',
    os: osMap[platform],
    arch: platform === 'darwin' ? getMacArch() : os.arch(),
    image_type: 'jre',
    jvm_impl: 'hotspot',
    heap_size: 'normal',
    vendor: 'eclipse',
  };

  const { drehmalDir } = storeToRefs(useInstallerStore());

  const javaPath = path.join(drehmalDir.value, 'installer', 'java_runtimes');
  if (!fs.existsSync(javaPath)) fs.mkdirSync(javaPath, { recursive: true });
  const javaNames = [
    platform === 'win32' ? 'java.exe' : 'java',
    platform === 'win32' ? 'javaw.exe' : 'java', // linux/mac does not have javaw
  ];
  console.log(`Checking for Java runtime in "${javaPath}"`);
  let javawExe = findFile(javaPath, javaNames[0]);
  let javaExe = findFile(javaPath, javaNames[1]);

  if (javaExe && javawExe) {
    console.log('Java runtime found, skipping download!');
    console.log(`Setting Java Exe path to "${javaExe}"`);
    javaStorePath.value = javaExe;
    console.log(`Setting Javaw Exe path to "${javawExe}"`);
    javawStorePath.value = javawExe;

    return javawExe;
  } else {
    console.log('Java runtime is missing, downloading...');
    if (!fs.existsSync(javaPath)) fs.mkdirSync(javaPath);

    const filePath = path.join(
      javaPath,
      platform === 'win32' ? 'java.zip' : 'java.tar.gz'
    );
    // eg for windows x64 java 17
    // https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jre/hotspot/normal/eclipse
    const url = `https://api.adoptium.net/v3/binary/latest/${flags.feature_version}/${flags.release_type}/${flags.os}/${flags.arch}/${flags.image_type}/${flags.jvm_impl}/${flags.heap_size}/${flags.vendor}`;

    const result = (await new Promise((resolve, reject) => {
      downloadFile(url, filePath).then(async () => {
        console.log(`Java zip successfully downloaded to: "${filePath}"`);
        ref.value.label = 'Extracting Java runtime';
        ref.value.progress = 0.125;
        ref.value.percent = 12.5;

        if (platform === 'win32') await extract(filePath, { dir: javaPath });
        else await tar.x({ file: filePath, cwd: javaPath });
        fs.unlinkSync(filePath);
        console.log(`Java zip successfully extracted to: "${javaPath}"`);

        console.log(`Checking for Java runtime in "${javaPath}"`);
        javawExe = findFile(javaPath, javaNames[0]);
        javaExe = findFile(javaPath, javaNames[1]);
        if (javaExe && javawExe) {
          console.log(`Setting Java Exe path to "${javaExe}"`);
          javaStorePath.value = javaExe;
          console.log(`Setting Javaw Exe path to "${javawExe}"`);
          javawStorePath.value = javawExe;
          if (platform !== 'win32') {
            console.log('Making javaw executable');
            ipcRenderer.invoke('execute', `chmod +x "${javawExe}"`);
          }

          resolve(javawExe);
        } else
          reject(
            `Could not find ${javaNames[0]} ${javaNames[1]} in "${javaPath}" after downloading`
          );
      });
    })) as string;

    return result;
  }
}

function findFile(dir: string, filename: string): string {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (filePath.endsWith('.zip')) continue;

    if (fs.statSync(filePath).isDirectory()) {
      const recursive = findFile(filePath, filename);
      if (recursive) return recursive;
    } else if (file === filename) return filePath;
  }
  return '';
}
