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
import { useInstallerStore } from 'src/stores/InstallerStore';
import { ref } from 'vue';
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
    console.log(`Server Path updated to "${serverDir.value}"`);
  }
};
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
