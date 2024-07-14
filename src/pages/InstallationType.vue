<template>
  <q-page padding>
    <div class="body">
      <!-- Body Content -->
      <div class="q-pa-sm fixed-center selector">
        <!-- <div>
          NOTE: UNFINISHED. WIP for allowing user-selected version
          <q-select
            hint="Selected Version"
            stack-label
            dark
            item-aligned
            input-class="center"
            color="accent"
            v-model="selectedVersion"
            :options="sources"
            @input-value="sourceSelect"
            style="width: 50%"
            bg-color="primary"

          ></q-select>
        </div> -->

        <div>
          <q-list bordered separator>
            <q-item
              clickable
              v-ripple
              to="/singleplayer/"
              @click="typeSelect('singleplayer')"
            >
              <q-item-section>
                <q-item-label header class="text-info text-h5"
                  >Singleplayer Installation
                </q-item-label>
                <q-item-label class="text-accent"
                  >For playing in singleplayer
                </q-item-label>
                <q-item-label
                  >Includes: Drehmal Map, Resource Pack, Fabric Client, and
                  Client-Side Mods.
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              to="/multiplayer/"
              @click="typeSelect('multiplayer')"
            >
              <q-item-section>
                <q-item-label header class="text-info text-h5"
                  >Multiplayer Installation
                </q-item-label>
                <q-item-label class="text-accent"
                  >For playing on multiplayer servers
                </q-item-label>
                <q-item-label
                  >Includes: Resource Pack, Fabric Client, and Client-Side Mods.
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              to="/server/"
              @click="typeSelect('server')"
            >
              <q-item-section>
                <!-- <q-item-label overline>Coming Soon!</q-item-label> -->
                <q-item-label header class="text-info text-h5"
                  >Server Installation
                </q-item-label>
                <q-item-label class="text-accent"
                  >For hosting a multiplayer server.
                </q-item-label>
                <q-item-label
                  >Includes: Drehmal Map, Minecraft Server Jar.
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useStateStore } from 'src/stores/StateStore';
import { useSourcesStore } from 'stores/SourcesStore';

const path = require('path');
const { ipcRenderer } = require('electron');

const { versions, selectedVersion, map, resourcePack, server, launcher } =
  storeToRefs(useSourcesStore());
const { installType } = storeToRefs(useStateStore());
const { drehmalDir } = storeToRefs(useInstallerStore());

// NOTE: UNFINISHED. WIP for allowing user-selected version
const sources = Object.keys(versions.value);
const sourceSelect = async (value: string) => {
  console.log('changed source to:', value);
  const mapVersion = versions.value[selectedVersion.value].map.version;
  console.log(`Using source: ${selectedVersion.value} (v${mapVersion})`);

  map.value = versions.value[selectedVersion.value].map;
  resourcePack.value = versions.value[selectedVersion.value].resourcepack;
  server.value = versions.value[selectedVersion.value].server;
  launcher.value = versions.value[selectedVersion.value].launcher;
  console.log(
    `Updated map, resource pack, server, and launcher source data with ${selectedVersion.value} sources (v${mapVersion})`
  );
};

const typeSelect = async (type: 'singleplayer' | 'multiplayer' | 'server') => {
  console.log(`Selected installation type: ${type}`);
  installType.value = type;

  if (type === 'singleplayer' || type === 'multiplayer') {
    const drehmalPath = await ipcRenderer.invoke('getDrehmalPath');
    drehmalDir.value = drehmalPath;
    console.log(`Setting Drehmal installation path to "${drehmalPath}"`);
  } else {
    const desktopPath = await ipcRenderer.invoke('getDesktopPath');
    drehmalDir.value = path.join(desktopPath, 'Drehmal Server');
    console.log(`Setting Drehmal installation path to "${drehmalDir.value}"`);
  }
};
</script>

<style scoped>
.header {
  color: white;
  font-size: 48px;
  padding: 10px;
}

.header img {
  height: 2em;
  vertical-align: middle;
}

.selector {
  width: 100%;
}
</style>
