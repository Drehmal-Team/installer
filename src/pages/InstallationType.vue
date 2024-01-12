<template>
  <q-page padding>
    <div class="body">
      <!-- Body Content -->
      <div class="q-pa-sm fixed-center selector">
        <q-list bordered separator>
          <q-item
            clickable
            v-ripple
            to="/singleplayer/"
            @click="installType = 'singleplayer'"
          >
            <q-item-section>
              <q-item-label header class="text-info text-h5"
                >Singleplayer Installation</q-item-label
              >
              <q-item-label class="text-accent"
                >For playing in singleplayer</q-item-label
              >
              <q-item-label
                >Includes: Drehmal Map, Resource Pack, Fabric Client, and
                Client-Side Mods.</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            to="/multiplayer/"
            @click="installType = 'multiplayer'"
          >
            <q-item-section>
              <q-item-label header class="text-info text-h5"
                >Multiplayer Installation</q-item-label
              >
              <q-item-label class="text-accent"
                >For playing on multiplayer servers</q-item-label
              >
              <q-item-label
                >Includes: Resource Pack, Fabric Client, and Client-Side
                Mods.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/server/"
            @click="installType = 'server'"
          >
            <q-item-section>
              <!-- <q-item-label overline>Coming Soon!</q-item-label> -->
              <q-item-label header class="text-info text-h5"
                >Server Installation</q-item-label
              >
              <q-item-label class="text-accent"
                >For hosting a multiplayer server.</q-item-label
              >
              <q-item-label
                >Includes: Drehmal Map, Minecraft Server Jar.</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const { ipcRenderer } = require('electron');
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useStateStore } from 'src/stores/StateStore';
import { onMounted } from 'vue';

const { installType } = storeToRefs(useStateStore());

const q = useQuasar();

async function checkJavaInstallation() {
  const platform = await ipcRenderer.invoke('getPlatformPretty');
  const arch = await ipcRenderer.invoke('getArch');

  // Verify the user has java installed, otherwise prevent them from continuing
  let javaCheckResult = false;
  // Loop until java installation is verified
  while (!javaCheckResult) {
    try {
      // check java installation
      await ipcRenderer.invoke('checkJava');
      javaCheckResult = true;
    } catch (error) {
      // 'checkJava' throws an error if java is not installed (fails to run 'java -version')
      // await a new promise until user clicks ok, otherwise the dialog is spammed
      await new Promise<void>((resolve) => {
        q.dialog({
          title: 'Java not installed',
          // allow html in dialog message
          html: true,
          // provide user with their current OS type and architecture, then provide a link to the java downloads page
          message:
            'Java is not installed on your system.' +
            ` Please download the installer for <span style="color: #ffde00;"><strong>${platform}-${arch}</strong></span> and install it.<br/><br/>` +
            '<a href="open-java-page://">Java Downloads Page</a><br/><br/>' +
            'After installing, click the button below.',
          ok: 'I have installed Java', // text for the ok button
          persistent: true,
          dark: true,
        }).onOk(() => resolve()); // resolve promise on ok button click
      });
    }
  }
}

onMounted(checkJavaInstallation);
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
