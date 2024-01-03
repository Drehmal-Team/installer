<template>
  <div class="progress-div">
    <div class="this-bar">
      <q-linear-progress
        size="20px"
        :value="progress"
        color="accent"
        class="q-mt-sm"
      >
        <div class="absolute-full flex flex-center">
          <q-badge
            color="white"
            text-color="accent"
            :label="`Shard ${index}: ${progressLabel}`"
          />
        </div>
      </q-linear-progress>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['index', 'progress']);

const progress = computed(() => props.progress);
const progressLabel = computed(() => (progress.value * 100).toFixed(2) + '%');
</script>
<style scoped>
.progress-div {
  border: 5px solid #493270;
  border-radius: 10px;
  height: 50px;
  /* width: 60%; */
  background-color: #7e57c2;
  display: flex;
  justify-content: center;
}
.this-bar {
  display: flex;
  align-items: center;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  padding: 5px;
}
</style>
