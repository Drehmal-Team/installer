import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
const { ipcRenderer } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

export async function installServer(ref: Ref) {
  const { server } = storeToRefs(useSourcesStore());
  const { serverDir, memory } = storeToRefs(useInstallerStore());

  const serverPath = path.join(serverDir.value, 'server.jar');
  console.log(`Downloading server jar to ${serverPath}`);

  ref.value.label = 'Downloading server jar';
  ref.value.progress = 0.25;
  ref.value.percent = 25;

  downloadFile(server.value.source, serverPath).then(() => {
    ref.value.label = 'Configuring server';
    ref.value.progress = 0.5;
    ref.value.percent = 50;
    fs.writeFileSync(
      path.join(serverDir.value, 'eula.txt'),
      'eula=true',
      'utf-8'
    );

    ref.value.label = 'Updating server properties';
    ref.value.progress = 0.75;
    ref.value.percent = 75;
    fs.writeFileSync(
      path.join(serverDir.value, 'server.properties'),
      server.value.properties,
      'utf-8'
    );

    ref.value.label = 'Creating executable file';
    ref.value.progress = 0.75;
    ref.value.percent = 75;

    const memoryInMb = Math.round(memory.value * 1024);
    const command = `java -Xmx${memoryInMb}M -Xms${memoryInMb}M -jar "${serverPath}" nogui`;

    ipcRenderer.invoke('getPlatform').then((result: NodeJS.Platform) => {
      switch (result) {
        case 'win32':
          fs.writeFileSync(
            path.join(serverDir.value, 'server.bat'),
            `@echo off\n${command}\npause`,
            'utf-8'
          );
          break;
        case 'darwin':
          fs.writeFileSync(
            path.join(serverDir.value, 'server.sh'),
            `#!/bin/bash\n${command}`,
            'utf-8'
          );
          exec(`chmod +x "${path.join(serverDir.value, 'server.sh')}"`);
          break;
        case 'linux':
          fs.writeFileSync(
            path.join(serverDir.value, 'run.sh'),
            `#!/bin/bash\n${command}`,
            'utf-8'
          );
          exec(`chmod +x "${path.join(serverDir.value, 'run.sh')}"`);
          break;
        default:
        // TODO: unrecognised platform
      }
    });

    ref.value.label = 'Server successfully installed!';
    ref.value.progress = 1;
    ref.value.percent = 100;
  });
}
