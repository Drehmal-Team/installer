<template>
  <p>
    You may configure some common server configs here. These will be written to
    the
    <span class="custom">server.properties</span> file found in the server's
    folder. Feel free to edit these settings later if you wish.
  </p>

  <!-- configuration components -->
  <div class="options-div white center">
    <!-- difficulty configuration options -->
    <div class="difficulty-div">
      <q-btn-toggle
        v-model="serverOpts.difficulty"
        toggle-color="secondary"
        spread
        :options="[
          { label: 'Easy', value: 'easy' },
          { label: 'Normal', value: 'normal' },
          { label: 'Hard', value: 'hard' },
        ]"
      />
    </div>

    <!-- pvp configuration toggle -->
    <div class="pvp-div">
      <q-toggle
        v-model="serverOpts.pvp"
        color="accent"
        label="Enable PvP?"
        left-label
        size="lg"
      />
    </div>

    <!-- hardcore configuration toggle -->
    <div class="hardcore-div">
      <q-toggle
        v-model="serverOpts.hardcore"
        color="accent"
        label="Hardcore?"
        left-label
        size="lg"
      />
    </div>

    <!-- motd configuration input text field -->
    <div class="motd-div">
      <q-input
        standout
        v-model="serverOpts.motd"
        label="Server MotD"
        label-color="white"
        color="primary"
        input-style="color: #ffde00"
        bg-color="secondary"
        clearable
      />
    </div>

    <!-- max player configuration slider -->
    <div class="max-players-div">
      <div style="padding-bottom: 2px">
        <q-item-section>
          <q-item-label>
            Max Players: <span class="custom">{{ serverOpts.maxPlayers }}</span>
          </q-item-label>
        </q-item-section>
      </div>
      <q-slider
        v-model="serverOpts.maxPlayers"
        :min="1"
        :max="20"
        :step="1"
        snap
        color="accent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';

const { serverOpts } = storeToRefs(useInstallerStore());
</script>
<style scoped lang="sass">
.options-div
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 20px

p
  padding: 10px

.motd-div
  width: 50%
.difficulty-div
  width: 50%

.pvp-div
  width: 50%
  background-color: #7e57c2

.hardcore-div
  width: 50%
  background-color: #7e57c2

.max-players-div
  padding: 0.5rem

  background-color: #7e57c2

  border-radius: 0.3rem

  text-align: center
  line-height: 32px
  width: 50%
  height: 60px
</style>
