import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStateStore = defineStore('state', () => {
  const disableNav = ref(false);
  const disableBackNav = ref(false);
  const disableNextNav = ref(false);
  const processingShards = ref(false);
  const processingFabric = ref(false);
  const processingMods = ref(false);

  return {
    disableNav,
    disableBackNav,
    disableNextNav,
    processingShards,
    processingFabric,
    processingMods,
  };
});
