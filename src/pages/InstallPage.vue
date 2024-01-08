<template>
  <q-page class="q-pa-sm flex flex-center">
    <div v-if="installType === 'singleplayer'" class="full-width">
      <singleplayer-install />
    </div>
    <div v-else-if="installType === 'multiplayer'" class="full-width">
      <multiplayer-install />
    </div>
    <div v-else-if="installType === 'server'" class="full-width">
      <server-install />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SingleplayerInstall from 'src/components/SingleplayerInstall.vue';
import MultiplayerInstall from 'src/components/MultiplayerInstall.vue';
import ServerInstall from 'src/components/ServerInstall.vue';
import log from 'electron-log';

import { storeToRefs } from 'pinia';
import { useStateStore } from 'src/stores/StateStore';

const { installType } = storeToRefs(useStateStore());
log.info(installType.value);
</script>
<style scoped lang="sass"></style>
