<template>
  <div class="ram-select white">
    <div style="padding-bottom: 10px">
      <q-item-section>
        <q-item-label>
          Ram Allocation: <span class="custom">{{ memory }}GB</span> (Min:
          {{ minMem }}GB / Max {{ maxMem }}GB)
        </q-item-label>
      </q-item-section>
    </div>
    <div>
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
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
const os = require('os');

const { memory } = storeToRefs(useInstallerStore());

const minMem = 4;
const memoryInGB = os.totalmem() / Math.pow(1024, 3);
const maxMem = Math.round((memoryInGB * 0.75) / 0.5 - 1) * 0.5;
const recommendedMem = minMem + (maxMem - minMem) / 2;
memory.value = recommendedMem;
const step = 0.5;
</script>
<style scoped lang="sass">
.ram-select
  padding: 1rem

  background-color: #7e57c2

  border-radius: 0.3rem

  text-align: center
  font-weight: bold
  line-height: 48px
  width: 60%
  height: 96px
  max-height: 96px
</style>
