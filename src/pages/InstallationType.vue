<template>
  <q-page padding>
    <div class="body">
      <!-- Body Content -->
      <div class="q-pa-sm fixed-center selector">
        <q-list bordered separator>
          <q-item
            clickable
            v-ripple
            to="/singleplayer/"
            @click="installType = 'singleplayer'"
          >
            <q-item-section>
              <q-item-label header class="text-info text-h5"
                >Singleplayer Installation</q-item-label
              >
              <q-item-label class="text-accent"
                >For playing in singleplayer</q-item-label
              >
              <q-item-label
                >Includes: Drehmal Map, Resource Pack, Fabric Client, and
                Client-Side Mods.</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            to="/multiplayer/"
            @click="installType = 'multiplayer'"
          >
            <q-item-section>
              <q-item-label header class="text-info text-h5"
                >Multiplayer Installation</q-item-label
              >
              <q-item-label class="text-accent"
                >For playing on multiplayer servers</q-item-label
              >
              <q-item-label
                >Includes: Resource Pack, Fabric Client, and Client-Side
                Mods.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/server/"
            @click="installType = 'server'"
          >
            <q-item-section>
              <!-- <q-item-label overline>Coming Soon!</q-item-label> -->
              <q-item-label header class="text-info text-h5"
                >Server Installation</q-item-label
              >
              <q-item-label class="text-accent"
                >For hosting a multiplayer server.</q-item-label
              >
              <q-item-label
                >Includes: Drehmal Map, Minecraft Server Jar.</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStateStore } from 'src/stores/StateStore';

const { installType } = storeToRefs(useStateStore());
</script>

<style scoped>
.header {
  color: white;
  font-size: 48px;
  padding: 10px;
}
.header img {
  height: 2em;
  vertical-align: middle;
}
.selector {
  width: 100%;
}
</style>
