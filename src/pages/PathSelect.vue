<template>
  <q-page padding>
    <div class="body">
      <!-- Body Content -->
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque natus
        delectus dolore tempora perferendis, nihil fuga molestias id, pariatur
        dicta non quae necessitatibus dolor! Delectus et at quidem in
        perspiciatis. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Accusamus a ex dolorem in eum saepe esse iusto aperiam illum reiciendis
        quam, ut tempora. Labore impedit accusamus officia, laboriosam aliquam
        repellendus!
      </p>

      <div class="options-div">
        <folder-select></folder-select>
        <memory-select></memory-select>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FolderSelect from 'src/components/FolderSelect.vue';
import MemorySelect from 'src/components/MemorySelect.vue';
</script>

<style scoped>
.body p {
  margin: 10px;
  margin-bottom: 40px;
}
.options-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
</style>
