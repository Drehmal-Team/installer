<template>
  <label class="file-select">
    <div class="select-button flex custom">
      <span v-if="filePath !== '.'">{{ filePath }} </span>
      <span v-else>Select Minecraft Directory</span>
      <div class="folder-icon">
        <q-icon name="folder" />
      </div>
    </div>
    <input type="file" webkitdirectory @change="folderSelectChange" />
  </label>
</template>

<script setup lang="ts">
import log from 'electron-log';
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { ref } from 'vue';
const path = require('path');

const { minecraftDir, minecraftDirIsDefault } = storeToRefs(
  useInstallerStore()
);

const folderPath = ref(minecraftDir.value);
const filePath = ref('Select Minecraft Directory');
filePath.value = minecraftDir.value;
// const filePath = computed(() => {
//   let firstFilePath = folderPath.value.split('\\');
//   firstFilePath.pop();
//   installerStore.setMinecraftDir(filePath)
//   log.info(`Minecraft Path updated to ${installerStore.minecraftDir.value}`)
//   return path.join(...firstFilePath);
// });

// @change="(event) => (folderPath = event.target.files[0].path)"
const folderSelectChange = async (event: any) => {
  folderPath.value = event.target.files[0].path;

  let firstFilePath = folderPath.value.split('\\');
  firstFilePath.pop();
  minecraftDir.value = filePath.value;

  filePath.value = path.join(...firstFilePath);
  // installerStore.setMinecraftDir(filePath.value)
  minecraftDir.value = filePath.value;
  log.info(`Minecraft Path updated to ${minecraftDir.value}`);
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
