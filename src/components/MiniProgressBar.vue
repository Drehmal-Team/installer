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
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { computed } from 'vue';
const { map, mods, resourcePack } = storeToRefs(useSourcesStore());
const {
  homeDir,
  appDir,
  memory,
  minecraftDir,
  minecraftDirIsDefault,
  shardsDir,
} = storeToRefs(useInstallerStore());

const props = defineProps(['index', 'progress', 'percent', 'label']);

const progress = computed(() => props.progress);
// const progressLabel = computed(() => props.percent.toFixed(1) + '%');
const progressLabel = computed(() => {
  switch (props.percent) {
    case 0:
      return `Waiting: ${props.percent.toFixed(0)}%`;
      break;
    case 100:
      return 'Download complete!';
      break;

    default:
      return `Downloading: ${props.percent.toFixed(1)}%`;
      break;
  }
});
</script>
<style scoped>
/*  */
.progress-div {
  /* border: 3px solid #493270; */
  /* border-radius: 5px; */
  /* height: 20px; */
  /* width: 60%; */
  /* background-color: black; */
  /* background-color: #7e57c2; */
  /* display: flex; */
  /* font-size: 10px; */
  line-height: 10px;
  gap: 0px;
  /* justify-content: center; */
  margin: none;
  padding: none;
}
.progress-label {
  /* font-size: 10px; */
  display: block;
  text-align: left;
  padding-left: 20px;
}
</style>
