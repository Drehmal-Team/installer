<template>
  <q-page>
    <div v-if="installType === 'singleplayer' || installType === 'multiplayer'">
      <client-configuration />
    </div>

    <div v-else-if="installType === 'server'">
      <server-configuration />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ClientConfiguration from 'src/components/ClientConfiguration.vue';
import ServerConfiguration from 'src/components/ServerConfiguration.vue';
import { useStateStore } from 'src/stores/StateStore';

const { installType } = storeToRefs(useStateStore());
</script>
<style scoped lang="sass"></style>
