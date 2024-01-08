<template>
  <q-page padding>
    <div class="body">
      <p>
        In order to play Drehmal in singleplayer, you will need the map,
        client-side mods and resource pack.
        <br />
        <br />
        You may configure the installation directory and memory allocation for
        Drehmal below. If you are unsure, use the default options.
        <br />
      </p>

      <div class="options-div">
        <folder-select />
        <memory-select />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FolderSelect from 'src/components/FolderSelect.vue';
import MemorySelect from 'src/components/MemorySelect.vue';
</script>

<style scoped lang="sass">
.body p
  margin: 10px
  margin-bottom: 40px

.options-div
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 20px
</style>
