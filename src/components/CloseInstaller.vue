<template>
  <div>
    <q-btn
      size="20px"
      color="secondary"
      @click="click"
      label="Launch Minecraft"
      v-if="launchButton && installType !== 'server'"
    />
    <q-btn
      size="20px"
      color="secondary"
      @click="click"
      label="Close Installer"
      v-else
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStateStore } from 'src/stores/StateStore';
import { Ref, ref } from 'vue';
const fs = require('fs');
const { ipcRenderer } = require('electron');

const { installType } = storeToRefs(useStateStore());

const launchButton = ref(false);
const platform: Ref<NodeJS.Platform | undefined> = ref();

const windowsLocations: string[] = [
  // Microsoft Store install location
  'C:\\XboxGames\\Minecraft Launcher\\Content\\Minecraft.exe',
  // Legacy install location
  'C:\\Program Files (x86)\\Minecraft\\MinecraftLauncher.exe',
  // Legacy install location #2
  'C:\\Program Files (x86)\\Minecraft Launcher\\MinecraftLauncher.exe',
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
    // TODO: get executable locations for linux and macos
    case 'darwin':
      launchButton.value = false; // NOTE: disabled manually for now
      break;
    case 'linux':
      launchButton.value = false; // NOTE: disabled manually for now
      break;
    // If platform unrecognised, don't attempt to open Minecraft launcher
    default:
      launchButton.value = false;
  }
});

const click = () => {
  if (launchButton.value === true && installType.value !== 'server') {
    if (platform.value === 'win32') {
      console.log(
        `Launching Minecraft on ${platform.value} with file: "${windowsPath}"`
      );
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
    console.log('Closing installer...');
    ipcRenderer.invoke('quit');
  }
};
</script>
