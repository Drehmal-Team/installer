<template>
  <div>
    <q-btn
      size="20px"
      color="secondary"
      @click="click"
      label="Launch Minecraft"
      v-if="launchButton"
    />
    <q-btn
      size="20px"
      color="secondary"
      @click="click"
      label="Close Installer"
      v-if="!launchButton"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const fs = require('fs');
const { ipcRenderer } = require('electron');
import { Ref } from 'vue';

const launchButton = ref(false);
const platform: Ref<NodeJS.Platform | undefined> = ref();

const windowsLocations: string[] = [
  'C:\\XboxGames\\Minecraft Launcher\\Content\\Minecraft.exe',
];
let windowsPath = '';

ipcRenderer.invoke('getPlatform').then((result: NodeJS.Platform) => {
  platform.value = result;
  switch (result) {
    case 'win32':
      windowsLocations.forEach((path) => {
        if (fs.existsSync(path)) {
          windowsPath = path;
          launchButton.value = true;
        }
      });
      break;
    // On both MacOS ('darwin') and Linux, Minecraft's installer is callable from the command line
    // source: https://minecraft.fandom.com/wiki/Minecraft_Launcher#Command_line_usage
    case 'darwin':
      launchButton.value = true;
      break;
    case 'linux':
      launchButton.value = true;
      break;
    // If platform unrecognised, don't attempt to open Minecraft launcher
    default:
      launchButton.value = false;
    // TODO: unrecognised platform
  }
});

const click = () => {
  if (launchButton.value === true) {
    if (platform.value === 'win32') {
      console.log(
        `Launching Minecraft on ${platform.value} with file: ${windowsPath}`
      );
      throw Error('Launch button should not be visible');
      ipcRenderer.invoke('minecraftWin', windowsPath).then(() => {
        console.log('Minecraft launched, exiting...');
        ipcRenderer.invoke('quit');
      });
    } else {
      console.log(
        `Launching Minecraft on ${platform.value} with cmd: minecraft-launcher`
      );
      ipcRenderer.invoke('minecraftNotWin').then(() => {
        console.log('Minecraft launched, exiting...');
        ipcRenderer.invoke('quit');
      });
    }
  } else {
    throw Error('Launch button should not be visible');
    console.log('Closing installer...');
    ipcRenderer.invoke('quit');
  }
};
</script>
