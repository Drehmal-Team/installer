<template>
  <label class="file-select">
    <div class="select-button flex custom">
      <q-item-section @click="folderSelectChange('minecraft')">
        <q-item-label overline>Minecraft Installation Directory</q-item-label>
        <q-item-label class="text-accent">{{ minecraftDir }}</q-item-label>
      </q-item-section>
      <div class="folder-icon">
        <q-icon name="folder" />
      </div>
    </div>
  </label>
  <label class="file-select">
    <div class="select-button flex custom">
      <q-item-section @click="folderSelectChange('drehmal')">
        <q-item-label overline>Drehmal Directory</q-item-label>
        <q-item-label class="text-accent">{{ drehmalDir }}</q-item-label>
      </q-item-section>
      <div class="folder-icon">
        <q-icon name="folder" />
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">
const { ipcRenderer } = require('electron');
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';

const { minecraftDir, drehmalDir } = storeToRefs(useInstallerStore());

const folderSelectChange = async (type: 'minecraft' | 'drehmal') => {
  const result = await ipcRenderer.invoke('openFileDialog');
  if (!result.canceled && result.filePaths.length > 0) {
    if (type === 'minecraft') minecraftDir.value = result.filePaths[0];
    else if (type === 'drehmal') drehmalDir.value = result.filePaths[0];

    console.log(`${type} path updated to "${drehmalDir.value}"`);
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
  padding: 5px;
  padding-right: 20px;

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
