import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useStateStore = defineStore('state', () => {
  const disableNav = ref(false);
  const disableBackNav = ref(false);
  const disableNextNav = ref(false);

  const processingShards = ref(false);
  const processingFabric = ref(false);
  const processingMods = ref(false);
  const processingResourcepack = ref(false);
  const processingServer = ref(false);

  const installType: Ref<'singleplayer' | 'multiplayer' | 'server'> =
    ref('singleplayer');

  return {
    disableNav,
    disableBackNav,
    disableNextNav,
    processingShards,
    processingFabric,
    processingMods,
    processingResourcepack,
    processingServer,
    installType,
  };
});
