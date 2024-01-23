<template>
  <q-page padding>
    <div class="body">
      <div v-if="installType === 'server' && platform === 'win32'">
        <p>
          Thanks for downloading Drehmal! To start the server, run the
          <span style="color: #ffde00"
            ><strong>{{ executable }}</strong></span
          >
          file. This opens a terminal window for the server in which you can
          enter commands.
        </p>

        <img
          src="../assets/images/transparent-logo.png"
          style="max-width: 224px"
        />
      </div>
      <div v-else-if="installType === 'server'">
        <!-- <p>
          Thanks for downloading Drehmal!
          <br />
          To start the server, run the following command to make the server
          script executable:<br />
          <span style="color: #ffde00"
            ><strong>{{ executableCmd }}</strong></span
          ><br />After that, you can run the
          <span style="color: #ffde00"
            ><strong>{{ executable }}</strong></span
          >
          file. This opens a terminal window for the server in which you can
          enter commands.
        </p> -->
        <p>
          Thanks for downloading Drehmal! To start the server, run the
          <span style="color: #ffde00"
            ><strong>{{ executable }}</strong></span
          >
          file. This opens a terminal window for the server in which you can
          enter commands.
        </p>
        <img
          src="../assets/images/transparent-logo.png"
          style="max-width: 180px"
        />
      </div>
      <div v-else>
        <p>
          Thanks for downloading Drehmal! To get started, open the Minecraft
          launcher and select the Drehmal Apotheosis profile, then hit play.;
        </p>

        <img
          src="../assets/images/transparent-logo.png"
          style="max-width: 224px"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const { ipcRenderer } = require('electron');
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useStateStore } from 'src/stores/StateStore';
import { Ref } from 'vue';
import { ref } from 'vue';
const path = require('path');

const { installType } = storeToRefs(useStateStore());
const { serverDir } = storeToRefs(useInstallerStore());

const platform: Ref<NodeJS.Platform | undefined> = ref();

const executable = ref('');
const additionalText = ref('');
const executableCmd = ref('');

if (installType.value === 'server') {
  ipcRenderer.invoke('getPlatform').then((result: NodeJS.Platform) => {
    platform.value = result;

    if (platform.value === 'win32') executable.value = 'server.bat';
    else {
      executable.value = 'server.sh';
      executableCmd.value = `chmod +x ${path.join(
        serverDir.value,
        'server.sh'
      )}`;
      additionalText.value =
        'You may need to make it executable first. To do that, run "chmod +x server.sh" in the terminal.';
    }
  });
}
</script>

<style scoped></style>
