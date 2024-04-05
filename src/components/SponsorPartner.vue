<template>
  <div>
    <!-- <p>
      Drehmal is sponsored by Apex Hosting. Click the banner below to support
      the dev team and create your multiplayer Drehmal server!
    </p> -->
    <q-list bordered separator>
      <q-item clickable v-ripple @click="openUrl(partner.affilLink)">
        <q-item-section
          style="display: flex; justify-content: center; align-items: center"
        >
          <q-item-label header class="text-info"
            >Drehmal is sponsored by Apex Hosting!</q-item-label
          >
          <q-item-label class="text-accent">
            Click the banner below to support the dev team and create your
            multiplayer Drehmal server!
          </q-item-label>
          <q-img
            src="../assets/images/partner/apex_hosting_logo_white.png"
            style="max-width: 480px"
            no-spinner
            no-transition
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- <q-item
            clickable
            v-ripple
            to="/singleplayer/"
            @click="typeSelect('singleplayer')"
          > -->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSourcesStore } from 'src/stores/SourcesStore';
const { ipcRenderer } = require('electron');

const { partner } = storeToRefs(useSourcesStore());

const openUrl = (url: string) => {
  ipcRenderer.invoke('openInBrowser', url);
};
</script>

<style scoped lang="sass">
p
  font-size: 14px
.border
  border: 2px solid #e2e2e2
.selector
  width: 100%
</style>
