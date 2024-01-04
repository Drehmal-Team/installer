<template>
  <div
    class="nav-button"
    :class="{
      disabled:
        processingShards ||
        processingFabric ||
        processingMods ||
        disableNav ||
        disableBackNav,
    }"
    @click="
      if (
        !(
          processingShards ||
          processingFabric ||
          processingMods ||
          disableNav ||
          disableBackNav
        )
      )
        nav(path);
    "
  ></div>
</template>

<script setup lang="ts">
import { useStateStore } from 'src/stores/StateStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
const {
  processingShards,
  processingFabric,
  processingMods,
  disableNav,
  disableBackNav,
} = storeToRefs(useStateStore());

defineProps(['path']);

const router = useRouter();
const nav = (path: string) => router.push(path);
</script>

<style scoped>
.nav-button {
  height: 44px;
  width: 68px;
  background: url('src/assets/images/back-button-purple.png') no-repeat;
  display: inline-block;
  cursor: pointer;
}
.nav-button:hover {
  background: url('src/assets/images/back-button-yellow.png') no-repeat;
}
.disabled:hover {
  background: url('src/assets/images/back-button-grey.png') no-repeat;
}
.nav-button .disabled {
  background: url('src/assets/images/next-button-grey.png') no-repeat;
  cursor: default;
}
</style>
