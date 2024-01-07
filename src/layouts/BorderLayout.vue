<template>
  <div class="border-outer">
    <div class="border-inner">
      <q-layout
        container
        view="hhh lpR fFf"
        class="WAL__layout"
        style="min-height: 580px"
      >
        <q-header class="bg-primary text-white" elevated height-hint="98">
          <q-img
            src="../assets/images/title-img.png"
            style="max-width: 640px"
            v-if="titleImg"
            no-spinner
            no-transition
          />
          <span v-else-if="!titleImg" class="text-white text-h4">
            {{ pageTitle }}
            <q-img
              src="../assets/images/transparent-logo.png"
              style="height: 80px; width: 80px"
              no-spinner
              no-transition
            />
          </span>
          <hr />
        </q-header>

        <q-page-container>
          <router-view />
        </q-page-container>

        <q-footer
          elevated
          class="bg-primary text-white"
          style="min-height: 70px"
        >
          <hr />
          <div class="center">
            <div v-if="closeBtn" style="padding-top: 10px">
              <close-installer />
              <!-- <q-btn
                size="20px"
                color="secondary"
                @click="ipcRenderer.invoke('minecraft')"
                label="Close Installer"
              /> -->
            </div>
            <div class="nav">
              <back-button :path="backPath" v-if="backPath !== ''" />
              <next-button :path="nextPath" v-if="nextPath !== ''" />
            </div>
            <socials-grid v-if="socials" />
          </div>
        </q-footer>
      </q-layout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import CloseInstaller from 'src/components/CloseInstaller.vue';
import NextButton from '../components/NextButton.vue';
import SocialsGrid from '../components/SocialsGrid.vue';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStateStore } from 'src/stores/StateStore';

const {
  processingShards,
  processingFabric,
  processingMods,
  processingResourcepack,
} = storeToRefs(useStateStore());

const router = useRoute();

const titleImg = computed(() => router.meta.titleImg as boolean);
const pageTitle = computed(() => router.meta.title as string);
const closeBtn = computed(() => router.meta.closeBtn as boolean);
const socials = computed(() =>
  processingShards.value ||
  processingFabric.value ||
  processingMods.value ||
  processingResourcepack.value
    ? true
    : (router.meta.socials as boolean)
);
const nextPath = computed(() =>
  processingShards.value ||
  processingFabric.value ||
  processingMods.value ||
  processingResourcepack.value
    ? ''
    : (router.meta.next as string)
);
const backPath = computed(() =>
  processingShards.value ||
  processingFabric.value ||
  processingMods.value ||
  processingResourcepack.value
    ? ''
    : (router.meta.back as string)
);
</script>
<style lang="sass">
.border-inner
  border: 5px solid #e2e2e2
.border-outer
  border: 5px solid #c1bbca
.nav
  padding-top: 10px
  gap: 10px
  display: block
hr
  height: 5px
  background-color: #e2e2e2
  border: none
  padding: none
  margin: 0
.center
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
</style>
