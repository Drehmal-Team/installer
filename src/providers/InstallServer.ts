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
  const { drehmalDir, memory, javawExePath, serverOpts } = storeToRefs(
    useInstallerStore()
  );

  const serverPath = path.join(drehmalDir.value, 'server.jar');
  console.log(`Downloading server jar to "${serverPath}"`);

  ref.value.label = 'Downloading Java runtime';
  await getJre(ref);
  ref.value.progress = 0.5;
  ref.value.percent = 50;

  ref.value.label = 'Downloading server jar';

  downloadFile(server.value.source, serverPath).then(async () => {
    ref.value.progress = 0.67;
    ref.value.percent = 67;

    ref.value.label = 'Configuring server';
    console.log('Creating eula.txt');
    fs.writeFileSync(
      path.join(drehmalDir.value, 'eula.txt'),
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
      path.join(drehmalDir.value, 'server.properties'),
      serverProperties.join('\n'),
      'utf-8'
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    ref.value.progress = 0.88;
    ref.value.percent = 88;
    ref.value.label = 'Creating executable file';

    const memoryInMb = Math.round(memory.value * 1024);

    const relativeJavaPath = path.relative(
      drehmalDir.value,
      javawExePath.value
    );
    const relativeServerPath = path.relative(drehmalDir.value, serverPath);
    const command = `"${relativeJavaPath}" -Xms128M -Xmx${memoryInMb}M -jar "${relativeServerPath}" nogui`;

    const platform = (await ipcRenderer.invoke(
      'getPlatform'
    )) as NodeJS.Platform;
    const executableFileName =
      platform === 'win32' ? 'server.bat' : 'server.sh';
    const executablePath = path.join(drehmalDir.value, executableFileName);

    console.log(`Creating executable for ${platform} at "${executablePath}"`);
    switch (platform) {
      case 'win32':
        fs.writeFileSync(
          executablePath,
          `@echo off\n${command}\npause`,
          'utf-8'
        );
        break;
      case 'darwin':
      case 'linux':
        fs.writeFileSync(executablePath, `#!/bin/bash\n${command}`, 'utf-8');
        ipcRenderer.invoke('execute', `chmod +x "${executablePath}"`);
        break;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    ref.value.progress = 0.95;
    ref.value.percent = 95;
    ref.value.label = 'Creating README file';

    if (!fs.existsSync(drehmalDir.value))
      fs.mkdirSync(drehmalDir.value, { recursive: true });

    const readmeText =
      `To run the server, execute the ${executableFileName} file. This will open up a terminal window and start the server.` +
      '\n' +
      'You may enter Minecraft commands in this terminal (eg. /stop to save the world and stop the server).' +
      '\n\n' +
      'Files:' +
      '\n\t' +
      `- server.jar file is the java file that is used to run the server. It is a vanilla Minecraft server.jar for MC version ${server.value.version}` +
      '\n\t' +
      '- server.properties file is used to configure various server settings. ' +
      '\n\t  ' +
      'You should understand what each setting does before changing it. For more information, see the following wiki page:' +
      '\n\t  ' +
      'https://minecraft.wiki/w/Server.properties' +
      '\n\t  ' +
      'The following settings are *MANDATORY* and should not be modified:' +
      '\n\t\t> ' +
      server.value.properties.join('\n\t\t> ') +
      '\n\t' +
      '- eula.txt file is the file used to agree to the Minecraft EULA. The server will NOT run without this file and its contents.' +
      '\n\t' +
      `- ${executableFileName} is the script file used to run the server. It contains a basic command that uses the Java runtime to run the server using your selected memory settings.` +
      '\n\t' +
      '- ./installer is the folder is used to store the files used for the installation of Drehmal as well as any files needed for the game to run.' +
      '\n\t  ' +
      "DO NOT MODIFY/DELETE THESE FILES UNLESS YOU KNOW WHAT YOU'RE DOING." +
      '\n\t\t> ' +
      './shards folder is where the map download files are stored before being extracted and assembled in the world folder' +
      '\n\t\t> ' +
      './java_runtimes folder is where the custom java executable is stored' +
      '\n\t\t  ' +
      "If you do intend on deleting this, then you'll have to update the runtime script with the path to your chosen java runtime." +
      '\n\n' +
      'Feel free to move this server folder to a more convenient location, such as your desktop or a dedicated server folder.' +
      '\n' +
      'The server will still function as long as the contents and structure of this folder are unchanged.';

    const serverReadmePath = path.join(drehmalDir.value, 'README.txt');
    console.log(`Writing server README to "${serverReadmePath}"`);
    fs.writeFileSync(serverReadmePath, readmeText, 'utf-8');

    await new Promise((resolve) => setTimeout(resolve, 100));
    ref.value.label = 'Server successfully installed!';
    ref.value.progress = 1;
    ref.value.percent = 100;
  });
}
