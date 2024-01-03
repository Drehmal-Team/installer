<template>
  <div class="progress-div">
    <span class="progress-label">
      <span>
        {{ label }}
      </span>
    </span>
    <q-linear-progress
      size="10px"
      :value="progress"
      color="accent"
      class="q-mt-sm"
      animation-speed="200"
      rounded
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['index', 'progress', 'percent', 'label']);

const progress = computed(() => props.progress);
</script>
<style scoped>
.progress-div {
  line-height: 10px;
  gap: 0px;
  margin: none;
  padding: none;
}
.progress-label {
  display: block;
  text-align: left;
  padding-left: 20px;
}
</style>
