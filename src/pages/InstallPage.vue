<template>
  <div class="border-body">
    <q-layout view="hHh lpR fFf">
      <q-header>
        <div class="border-header">
          <!-- Header Content -->
          <div class="header">
            Download & Install
            <img src="../assets/images/transparent-logo.png" alt="" />
          </div>
        </div>
      </q-header>

      <q-page-container>
        <!-- Body Content -->
        <hr />

        <!-- <button @click="installClick">Download map files</button> -->
        <map-download :shards="shards"></map-download>
      </q-page-container>

      <q-footer>
        <!-- don't touch these class names-->
        <div class="border-footer">
          <div class="footer">
            <div class="nav-footer">
              <back-button path="/path/"></back-button>
              <next-button path="/complete/"></next-button>
            </div>
          </div>
        </div>
      </q-footer>
    </q-layout>
  </div>
</template>

<!-- <script setup> -->
<script setup lang="ts">
import log from 'electron-log';
import { storeToRefs } from 'pinia';
import MapDownload from 'src/components/MapDownload.vue';
import { Shard } from 'src/components/models';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { ref } from 'vue';
import BackButton from '../components/BackButton.vue';
import NextButton from '../components/NextButton.vue';

const { map } = storeToRefs(useSourcesStore());

log.info(map);
const versionFileName = map.value.versionName
  .toLowerCase()
  .split(' ')
  .join('-');
const shardsArr: Shard[] = [];
map.value.shards.forEach((shard, i) => {
  shardsArr.push({
    index: i,
    name: `${versionFileName}-${i}.tar.gz`,
    label: 'Waiting . . .',
    progress: 0,
    percent: 0,
    url: shard,
  });
});
const shards = ref<Shard[]>(shardsArr);
</script>

<style scoped>
.header {
  color: white;
  font-size: 48px;
  /* padding: 10px; */
}
.header img {
  height: 1.8em;
  vertical-align: middle;
}
</style>
