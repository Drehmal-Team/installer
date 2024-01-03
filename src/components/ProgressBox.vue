<template>
  <div class="border">
    <div class="this-div">
      <span class="label">{{ label }}</span>

      <q-linear-progress
        size="15px"
        :value="progress"
        color="accent"
        class="q-mt-sm bar"
        animation-speed="200"
      />
      <!-- <q-btn
        size="10px"
        color="secondary"
        label="Download Shards"
        class="this-btn"
      /> -->
      <span class="this-btn"
        ><div
          class="nav-button"
          :style="{ 'background-image': 'url(' + img + ')' }"
          @click="
            {
              if (!clicked) {
                click();
              }
            }
          "
        ></div
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps([
  'label',
  'progress',
  'percent',
  'buttonClick',
  'img',
]);
let clicked = ref(false);
const click = async () => {
  clicked.value = true;
  props.buttonClick();
};
</script>
<style scoped>
.border {
  width: 340px;
  height: 100px;
  background-color: #8151c4;
  border: 3px solid #511f95;
  border-radius: 10px;
  padding: 5px 0px;
}
.this-div {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.this-btn {
  text-align: right;
  padding-right: 5%;
  padding-top: 0px;
}
.bar {
  margin: auto;
  width: 90%;
}
.nav-button {
  height: 33px;
  width: 51px;
  background: url('src/assets/images/small-next-button-purple.png') no-repeat;
  display: inline-block;
  border: 1px solid #511f95;
  border-radius: 3px;
}
.nav-button:hover {
  background: url('src/assets/images/small-next-button-yellow.png') no-repeat;
}
.label {
  text-align: left;
  padding-left: 5%;
  font-size: 13px;
}
</style>
