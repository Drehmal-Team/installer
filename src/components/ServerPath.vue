<template>
  <label class="file-select">
    <div class="select-button flex custom">
      <q-item-section @click="folderSelectChange">
        <q-item-label overline v-if="defaultPath"
          >Using default directory</q-item-label
        >
        <q-item-label class="text-accent">{{ filePath }}</q-item-label>
      </q-item-section>
      <div class="folder-icon">
        <q-icon name="folder" />
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { onMounted, ref } from 'vue';
const { ipcRenderer } = require('electron');

const { serverDir } = storeToRefs(useInstallerStore());

const filePath = ref('Select Minecraft Directory');
filePath.value = serverDir.value;

const defaultPath = ref(true);

const folderSelectChange = async () => {
  const result = await ipcRenderer.invoke('openFileDialog');
  if (!result.canceled && result.filePaths.length > 0) {
    filePath.value = result.filePaths[0];
    defaultPath.value = false;
    serverDir.value = filePath.value;
    console.log(`Server Path updated to ${serverDir.value}`);
  }
};

const q = useQuasar();
async function checkJDK() {
  const platform = await ipcRenderer.invoke('getPlatformPretty');
  const arch = await ipcRenderer.invoke('getArch');

  // Verify the user has the right JDK version installed, otherwise prevent them from continuing
  let jdkVersion = 0;
  const jdkRequired = 17;
  // servers require jdk version 17 or above, loop until that's found
  while (jdkVersion < jdkRequired) {
    // check java installation
    jdkVersion = await ipcRenderer.invoke('checkJDK');
    if (jdkVersion <= jdkRequired)
      await new Promise<void>((resolve) => {
        q.dialog({
          title: 'JDK not installed',
          // allow html in dialog message
          html: true,
          // provide user with their current OS type and architecture, then provide a link to the java downloads page
          message:
            'The required JDK version is not installed on your system.' +
            ` Please download the installer for <span style="color: #ffde00;"><strong>${platform}-${arch}</strong></span> and install it.<br/><br/>` +
            '<a href="open-jdk-page://">JDK Downloads Page</a><br/><br/>' +
            'After installing, click the button below.',
          ok: 'I have installed the JDK', // text for the ok button
          persistent: true,
          dark: true,
        }).onOk(() => resolve()); // resolve promise on ok button click
      });
  }
}

onMounted(checkJDK);
</script>

<style scoped>
.file-select {
  line-height: 48px;
  width: 60%;
  max-height: 96px;
}
.file-select > .select-button:hover {
  background-color: #493270;
}
.file-select > .select-button {
  padding: 1rem;

  background-color: #7e57c2;

  border-radius: 0.3rem;

  text-align: center;
  font-weight: bold;
}
.file-select > input[type='file'] {
  display: none;
}

.folder-icon {
  font-size: 48px;
  margin-left: auto;
  margin-right: 0;
  vertical-align: middle;
}
</style>
