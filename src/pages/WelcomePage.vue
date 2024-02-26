<template>
  <q-page padding>
    <p>
      Welcome to the Drehmal v2.2: Apotheosis installer. This is designed to
      help set up all mods, saves, and resource packs you may need to play the
      greatest survival exploration experience in Minecraft!
    </p>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
const path = require('path');
const { ipcRenderer } = require('electron');

// Ensure these are initialised; Be careful if removing
useSourcesStore();
useInstallerStore();

const { homeDir, appDir, minecraftDir, memory } = storeToRefs(
  useInstallerStore()
);

ipcRenderer.invoke('getMinecraftPath').then((minecraft) => {
  console.log(`Got Minecraft path: ${minecraft}`);
  minecraftDir.value = minecraft;
});

ipcRenderer.invoke('getAppDataPath').then((appData) => {
  console.log(`Got AppData path: ${appData}`);
  homeDir.value = appData;
  appDir.value = path.join(appData, 'Drehmal Installer');
  memory.value = 4;
});

// Drehmal path not set here, will be set after user selects an installation type
// src/pages/InstallPage.vue
</script>
<style scoped lang="sass">
p
  font-size: 18px
</style>
