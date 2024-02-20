<template>
  <q-page padding>
    <div class="body">
      <div v-if="installType === 'server'">
        <p>
          Thanks for downloading Drehmal! To start the server, run the
          <span style="color: #ffde00"
            ><strong>{{ executable }}</strong></span
          >
          file. This opens a terminal window for the server in which you can
          enter commands.
        </p>
      </div>
      <div v-else>
        <p>
          Thanks for downloading Drehmal! To get started, open the Minecraft
          launcher and select the Drehmal Apotheosis profile, then hit play.
        </p>
      </div>
      <img
        src="../assets/images/transparent-logo.png"
        style="max-width: 180px"
      />
      <p>
        Credit for the resources used in this project can be found on
        <a
          href="https://github.com/Drehmal-Team/installer?tab=readme-ov-file#credits"
          style="color: #3f9ae4"
          >GitHub</a
        >. Enjoy!
      </p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const { ipcRenderer } = require('electron');
import { storeToRefs } from 'pinia';
import { useStateStore } from 'src/stores/StateStore';
import { ref } from 'vue';

const { installType } = storeToRefs(useStateStore());

const executable = ref('');

if (installType.value === 'server') {
  ipcRenderer
    .invoke('getPlatform')
    .then(
      (result: NodeJS.Platform) =>
        (executable.value = result === 'win32' ? 'server.bat' : 'server.sh')
    );
}
</script>

<style scoped></style>
