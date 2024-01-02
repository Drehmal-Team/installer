<template>
  <!-- <div class="ram-select custom">
    <span>RAM Allocation? (max {{ maxMem }}GB)</span>
    <input type="number" v-model.number="ram" />
  </div>
  <div class="q-pa-md"> -->

  <!-- <q-slider v-model="memoryAllocated" :min="maxMem / 2" :max="maxMem" /> -->

  <div class="ram-select white">
    <!-- <span>RAM Allocation? (max {{ maxMem }}GB)</span> -->
    <span
      >Ram Allocation: <span class="custom">{{ memory }}GB</span> (Max
      {{ maxMem }}GB)</span
    >
    <span></span>
    <q-slider
      v-model="memory"
      :min="minMem"
      :max="maxMem"
      :step="step"
      label
      snap
      color="accent"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { ref, watch } from 'vue';
const os = require('os');

const { map, mods, resourcePack } = storeToRefs(useSourcesStore());
const {
  homeDir,
  appDir,
  memory,
  minecraftDir,
  minecraftDirIsDefault,
  shardsDir,
} = storeToRefs(useInstallerStore());

const minMem = 4;
const memoryInGB = os.totalmem() / Math.pow(1024, 3);
const maxMem = Math.round(memoryInGB / 0.5 - 1) * 0.5;
const step = 0.5;
// const value = ref(mem); // in GB

// watch(memory, async () => (installerStore.memory = value.value));
</script>
<style scoped>
.ram-select {
  padding: 1rem;

  background-color: #7e57c2;

  border-radius: 0.3rem;

  text-align: center;
  font-weight: bold;
  line-height: 48px;
  width: 60%;
  height: 96px;
  max-height: 96px;
}
</style>
