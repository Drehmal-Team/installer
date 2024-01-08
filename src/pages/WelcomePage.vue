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
import log from 'electron-log';
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
const path = require('path');
const { ipcRenderer } = require('electron');

// Ensure these are initialised; Be careful if removing
useSourcesStore();
useInstallerStore();

const { homeDir, appDir, minecraftDir, serverDir, shardsDir, memory } =
  storeToRefs(useInstallerStore());

ipcRenderer.invoke('getAppDataPath').then((appData) => {
  log.info(`Got AppData path: ${appData}`);
  homeDir.value = appData;
  appDir.value = path.join(appData, 'Drehmal Installer');
  minecraftDir.value = path.join(appData, '.minecraft');
  shardsDir.value = path.join(appDir.value, 'shards');
  memory.value = 4;
});

ipcRenderer.invoke('getDesktopPath').then((desktop) => {
  log.info(`Got Desktop path: ${desktop}`);
  serverDir.value = path.join(desktop, 'Drehmal Server');
});
</script>
<style scoped lang="sass">
p
  font-size: 18px
</style>
