<template>
  <div>
    <img
      src="../assets/images/next-button-grey.png"
      :class="{ clickable: hover, disabled: isDisabled }"
      @mouseleave="hover = false"
      @mouseover="hover = true"
      v-show="isDisabled"
      width="68px"
      height="44px"
    />
    <img
      src="../assets/images/next-button-yellow.png"
      :class="{ clickable: hover, disabled: isDisabled }"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="nav(path)"
      v-show="hover && !isDisabled"
      width="68px"
      height="44px"
    />
    <img
      src="../assets/images/next-button-purple.png"
      :class="{ clickable: hover, disabled: isDisabled }"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="nav(path)"
      v-show="!hover && !isDisabled"
      width="68px"
      height="44px"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStateStore } from 'src/stores/StateStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const {
  processingShards,
  processingFabric,
  processingMods,
  processingResourcepack,
  disableNav,
  disableNextNav,
} = storeToRefs(useStateStore());

defineProps(['path']);

let hover = ref(false);
const isDisabled = computed(
  () =>
    processingShards.value ||
    processingFabric.value ||
    processingMods.value ||
    processingResourcepack.value ||
    disableNav.value ||
    disableNextNav.value
);

const router = useRouter();
const nav = (path: string) => {
  // reset hover state on transition, otherwise new pages will have a hover state
  hover.value = false;
  router.push(path);
};
</script>

<style scoped lang="sass">
div
  display: inline-block
</style>
