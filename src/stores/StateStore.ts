import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useStateStore = defineStore('state', () => {
  const customConfig = ref(false);
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
    customConfig,
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
