<template>
  <q-page
    padding
    style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    "
  >
    <p>
      Welcome to the Drehmal: APOTHEOSIS installer. This is designed to help set
      up all mods, saves, and resource packs you may need to play the greatest
      survival exploration experience in Minecraft!
    </p>

    <sponsor-partner />
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { useStateStore } from 'src/stores/StateStore';
import SponsorPartner from 'src/components/SponsorPartner.vue';

const path = require('path');
const { ipcRenderer } = require('electron');

// Ensure these are initialised; Be careful if removing
useSourcesStore();
useInstallerStore();

const { homeDir, appDir, minecraftDir, memory } = storeToRefs(
  useInstallerStore()
);
const {
  manifest,
  selectedVersion,
  versions,
  map,
  resourcePack,
  server,
  launcher,
} = storeToRefs(useSourcesStore());
const { customConfig } = storeToRefs(useStateStore());

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

ipcRenderer.invoke('getManifestData', manifest.value).then((data) => {
  console.log(`Fetched manifest data from "${manifest.value}"`);
  versions.value = data;
  const sources = Object.keys(data);
  console.log(`Got manifest data for the following sources: ${sources}`);
  // If "latest" exists in version list, use it; otherwise use the first version
  selectedVersion.value = sources.includes('latest') ? 'latest' : sources[0];
  const mapVersion = data[selectedVersion.value].map.version;
  console.log(`Using source: "${selectedVersion.value}" (v${mapVersion})`);
  map.value = data[selectedVersion.value].map;
  resourcePack.value = data[selectedVersion.value].resourcepack;
  server.value = data[selectedVersion.value].server;
  launcher.value = data[selectedVersion.value].launcher;
  console.log(
    `Updated map, resource pack, server, and launcher source data with "${selectedVersion.value}" sources (v${mapVersion})`
  );
});
</script>
<style scoped lang="sass">
p
  font-size: 18px
</style>
