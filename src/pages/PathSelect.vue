<template>
  <div class="border-body">
    <q-layout view="hHh lpR fFf">
      <q-header>
        <div class="border-header">
          <!-- Header Content -->
          <div class="header">
            Install Location
            <img src="../assets/images/transparent-logo.png" alt="" />
          </div>
        </div>
      </q-header>

      <q-page-container class="body">
        <div class="body">
          <!-- Body Content -->
          <hr />
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque
            natus delectus dolore tempora perferendis, nihil fuga molestias id,
            pariatur dicta non quae necessitatibus dolor! Delectus et at quidem
            in perspiciatis. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Accusamus a ex dolorem in eum saepe esse iusto aperiam illum
            reiciendis quam, ut tempora. Labore impedit accusamus officia,
            laboriosam aliquam repellendus!
          </p>

          <div class="options-div">
            <folder-select></folder-select>
            <memory-select></memory-select>
          </div>
        </div>
      </q-page-container>

      <q-footer>
        <!-- don't touch these class names-->
        <div class="border-footer">
          <div class="footer">
            <div class="nav-footer">
              <back-button path="/"></back-button>
              <next-button path="/install/"></next-button>
            </div>
          </div>
        </div>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import BackButton from 'src/components/BackButton.vue';
import FolderSelect from 'src/components/FolderSelect.vue';
import MemorySelect from 'src/components/MemorySelect.vue';
import NextButton from 'src/components/NextButton.vue';
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
