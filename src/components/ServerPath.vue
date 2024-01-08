<template>
  <label class="file-select">
    <div class="select-button flex custom">
      <q-item-section>
        <q-item-label overline v-if="defaultPath"
          >Using default directory</q-item-label
        >
        <q-item-label class="text-accent">{{ filePath }}</q-item-label>
      </q-item-section>
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

const { serverDir } = storeToRefs(useInstallerStore());

const folderPath = ref(serverDir.value);
const filePath = ref('Select Minecraft Directory');
filePath.value = serverDir.value;

const defaultPath = ref(true);

const folderSelectChange = async (event: any) => {
  folderPath.value = event.target.files[0].path;
  defaultPath.value = false;

  let firstFilePath = folderPath.value.split('\\');
  firstFilePath.pop();
  serverDir.value = filePath.value;

  filePath.value = path.join(...firstFilePath);
  serverDir.value = filePath.value;
  log.info(`Minecraft Path updated to ${serverDir.value}`);
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
