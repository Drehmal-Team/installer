import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
import { getJre } from './JavaDownload';
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

export async function installServer(ref: Ref) {
  const { server } = storeToRefs(useSourcesStore());
  const { serverDir, memory, javawExePath, serverOpts } = storeToRefs(
    useInstallerStore()
  );

  const serverPath = path.join(serverDir.value, 'server.jar');
  console.log(`Downloading server jar to "${serverPath}"`);

  ref.value.label = 'Downloading Java runtime';
  await getJre();
  ref.value.progress = 0.5;
  ref.value.percent = 50;

  ref.value.label = 'Downloading server jar';

  downloadFile(server.value.source, serverPath).then(async () => {
    ref.value.progress = 0.67;
    ref.value.percent = 67;

    ref.value.label = 'Configuring server';
    console.log('Creating eula.txt');
    fs.writeFileSync(
      path.join(serverDir.value, 'eula.txt'),
      'eula=true',
      'utf-8'
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    ref.value.progress = 0.75;
    ref.value.percent = 75;

    ref.value.label = 'Updating server properties';
    console.log(`Creating server.properties with ${server.value.properties}`);
    const serverProperties = server.value.properties.map(
      (property) => property
    );
    for (const key in serverOpts.value)
      serverProperties.push(
        `${key}=${serverOpts.value[key as keyof typeof serverOpts.value]}`
      );

    fs.writeFileSync(
      path.join(serverDir.value, 'server.properties'),
      serverProperties.join('\n'),
      'utf-8'
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    ref.value.progress = 0.88;
    ref.value.percent = 88;

    ref.value.label = 'Creating executable file';
    const memoryInMb = Math.round(memory.value * 1024);
    const command = `"${javawExePath.value}" -Xms128M -Xmx${memoryInMb}M -jar "${serverPath}" nogui`;
    // const command = `"${javawExePath.value}" -Xms${memoryInMb}M -Xmx${memoryInMb}M -jar "${serverPath}" nogui`;
    ipcRenderer.invoke('getPlatform').then((result: NodeJS.Platform) => {
      const chmodCmd = `chmod +x "${path.join(serverDir.value, 'server.sh')}"`;
      switch (result) {
        case 'win32':
          console.log(`Creating executable for ${result} server.bat`);
          fs.writeFileSync(
            path.join(serverDir.value, 'server.bat'),
            `@echo off\n${command}\npause`,
            'utf-8'
          );
          break;
        case 'darwin':
          console.log(`Creating executable for ${result} server.sh`);
          fs.writeFileSync(
            path.join(serverDir.value, 'server.sh'),
            `#!/bin/bash\n${command}`,
            'utf-8'
          );
          ipcRenderer.invoke('execute', chmodCmd);
          break;
        case 'linux':
          console.log(`Creating executable for ${result} server.sh`);
          fs.writeFileSync(
            path.join(serverDir.value, 'server.sh'),
            `#!/bin/bash\n${command}`,
            'utf-8'
          );
          ipcRenderer.invoke('execute', chmodCmd);
          break;
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    ref.value.label = 'Server successfully installed!';
    ref.value.progress = 1;
    ref.value.percent = 100;
  });
}
