<template>
  <div class="center">
    <div class="top-btn">
      <!-- big button for map here -->
      <!-- Map download -->
      <map-progress
        :downloadLabel="shardsProgress.downloadLabel"
        :downloadProgress="shardsProgress.downloadProgress"
        :downloadPercent="shardsProgress.downloadPercent"
        :extractLabel="shardsProgress.extractLabel"
        :extractProgress="shardsProgress.extractProgress"
        :extractPercent="shardsProgress.extractPercent"
        :img="shardsProgress.img"
        :buttonClick="shardsClick"
        :buttonDisabled="shardsDisabled"
      />
    </div>
    <br />
    <div class="bottom-btns">
      <!-- small 3 buttons for the other ones here -->
      <!-- Fabric download, install -->
      <progress-box
        :label="fabricProgress.label"
        :progress="fabricProgress.progress"
        :percent="fabricProgress.percent"
        :img="fabricProgress.img"
        :buttonClick="fabricClick"
        :buttonDisabled="fabricDisabled"
      />
      <!-- Mods download -->
      <progress-box
        :label="modsProgress.label"
        :progress="modsProgress.progress"
        :percent="modsProgress.percent"
        :img="modsProgress.img"
        :buttonClick="modsClick"
        :buttonDisabled="modsDisabled"
      />
      <!-- Resource Pack download -->
      <progress-box
        :label="resourcepackProgress.label"
        :progress="resourcepackProgress.progress"
        :percent="resourcepackProgress.percent"
        :img="resourcepackProgress.img"
        :buttonClick="resourcepackClick"
        :buttonDisabled="resourcepackDisabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MapProgress from 'src/components/MapProgress.vue';
import ProgressBox from 'src/components/ProgressBox.vue';
import {
  ProgressBox as ProgressBoxType,
  Shard,
  ShardsBox,
} from 'src/components/models';
import { downloadShards } from 'src/providers/DownloadShards';
import {
  downloadMods,
  downloadResourcePack,
  installFabric,
} from 'src/providers/InstallFabric';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { useStateStore } from 'src/stores/StateStore';
import { ref } from 'vue';
const extract = require('extract-zip');
const fs = require('fs');
const path = require('path');
const { map } = storeToRefs(useSourcesStore());
const { minecraftDir, shardsDir } = storeToRefs(useInstallerStore());
const {
  processingShards,
  processingFabric,
  processingMods,
  processingResourcepack,
  disableBackNav,
} = storeToRefs(useStateStore());
const versionFileName = map.value.versionName
  .toLowerCase()
  .split(' ')
  .join('-');

const shardsArr: Shard[] = [];
const downloadShardsLabel = ref('Download map');
let downloadShardsClicked = ref(false);

const shardsDisabled = ref(false);
const fabricDisabled = ref(false);
const modsDisabled = ref(false);
const resourcepackDisabled = ref(false);

map.value.shards.forEach((shard, i) =>
  shardsArr.push({
    index: i,
    name: `${versionFileName}-${i}.zip`,
    label: 'Waiting. . .',
    downloaded: 0,
    totalSize: 0,
    progress: 0,
    percent: 0,
    url: shard,
  })
);
const shardsProgress = ref<ShardsBox>({
  totalSize: 0,
  downloaded: 0,
  downloadLabel: 'Map Download - Press download button to begin',
  downloadProgress: 0,
  downloadPercent: 0,

  extractCount: 0,
  extracted: 0,
  extractLabel: 'Map Extract - Waiting for map download',
  extractProgress: 0,
  extractPercent: 0,

  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC',
});
const fabricProgress = ref<ProgressBoxType>({
  label: 'Fabric - Press download button',
  percent: 0,
  progress: 0,
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC',
});
const modsProgress = ref<ProgressBoxType>({
  label: 'Mods - Press download button',
  percent: 0,
  progress: 0,
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC',
});
const resourcepackProgress = ref<ProgressBoxType>({
  label: 'Resource Pack - Press downloa...',
  percent: 0,
  progress: 0,
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC',
});

const shardsClick = async () => {
  if (downloadShardsClicked.value) return;
  shardsDisabled.value = true;
  processingShards.value = true;
  disableBackNav.value = true;

  downloadShardsClicked.value = true;
  downloadShardsLabel.value = 'Downloading';

  const mapDir = path.join(minecraftDir.value, 'saves', map.value.versionName);
  const totalShards = map.value.shards.length;
  let downloaded = 0;
  let extracted = 0;

  if (!fs.existsSync(shardsDir.value))
    fs.mkdirSync(shardsDir.value, { recursive: true });
  if (!fs.existsSync(mapDir)) fs.mkdirSync(mapDir, { recursive: true });
  console.log(`Downloading map archives to ${shardsDir.value}`);
  console.log(`Extracting map to ${mapDir}`);

  map.value.shards.forEach((shard, index) => {
    const filePath = path.join(
      shardsDir.value,
      `${versionFileName}-${index}.zip`
    );

    downloadShards(shard, filePath, shardsProgress).then(async () => {
      downloaded++;
      if (downloaded === 1)
        shardsProgress.value.extractLabel = 'Extracting map files: 0%';

      if (downloaded === map.value.shards.length)
        shardsProgress.value.downloadLabel = 'Map successfully downloaded!';

      await extract(filePath, { dir: mapDir });
      console.log(`Extraction complete. Removing ${filePath}`);
      extracted++;
      fs.unlinkSync(filePath);
      shardsProgress.value.extracted = extracted;
      shardsProgress.value.extractProgress = extracted / totalShards;
      shardsProgress.value.extractPercent = (extracted / totalShards) * 100;
      shardsProgress.value.extractLabel = `Extracting map files: ${(
        (extracted / totalShards) *
        100
      ).toFixed(2)}%`;

      if (extracted === totalShards) {
        shardsProgress.value.extractLabel = 'Map successfully extracted!';
        processingShards.value = false;
      }
    });
  });
};

const fabricClick = async () => {
  processingFabric.value = true;
  disableBackNav.value = true;

  fabricDisabled.value = true;
  fabricProgress.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAByklEQVRYhd2YTVLCQBCFX6dYqIsIztyHI7DjGpYuRV2ouNTyGGRFbgD3yRDMAlhQtIs4KfKHhEwS4rcKSaboN6+7pys0ncwwGPbhOnNGCxkM++Q6cxAzw3XmTETo9i6bjqsQS38NZsZg2CeaTmYMAJZFuO62S8j3co3dLkykDgD0bq6ih0LYzURVEKWCaOP9xSoUotEiLuxOeuUZsQm2EMKGUkF0z0q+dO4igOwYLVADkZiGAIv+gRIC0AHKHR+jh6fY7/H7a6Xr8ihdEFLK6NrzvMrX5UGuM+NuL2y/QtgnF/vnx1csqLwd1k5IKeF53slObIJt1LWW/qq8I0mklFBKHXxeBcYc0eQ58zh6BjNHQt/GL6X+J+7IOn2OmCK580KI6B6z6fmUzTui0c4opYw6oTFeI7p484pWCBFdZznx1/pjMdJ+s9rn3f0tgNCZQ07krS9KZTWyj/maSFP5hKidqRqrhs2qHGZDqUXU/OBZOrV06iSHwGMgImPt2FiNnDJ6mOhWGmNC6irqPGppv3WQErIJtk3EUYisGGOppVQAIexWiNn/ggL8CvEXKwDh963kC+eMjhsIU6v5Q6A8pFOLAPC+whZBAPAD4SrOvdEMgKQAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
  installFabric(fabricProgress);
  return;
};
const modsClick = async () => {
  processingMods.value = true;
  disableBackNav.value = true;

  modsDisabled.value = true;
  modsProgress.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAByklEQVRYhd2YTVLCQBCFX6dYqIsIztyHI7DjGpYuRV2ouNTyGGRFbgD3yRDMAlhQtIs4KfKHhEwS4rcKSaboN6+7pys0ncwwGPbhOnNGCxkM++Q6cxAzw3XmTETo9i6bjqsQS38NZsZg2CeaTmYMAJZFuO62S8j3co3dLkykDgD0bq6ih0LYzURVEKWCaOP9xSoUotEiLuxOeuUZsQm2EMKGUkF0z0q+dO4igOwYLVADkZiGAIv+gRIC0AHKHR+jh6fY7/H7a6Xr8ihdEFLK6NrzvMrX5UGuM+NuL2y/QtgnF/vnx1csqLwd1k5IKeF53slObIJt1LWW/qq8I0mklFBKHXxeBcYc0eQ58zh6BjNHQt/GL6X+J+7IOn2OmCK580KI6B6z6fmUzTui0c4opYw6oTFeI7p484pWCBFdZznx1/pjMdJ+s9rn3f0tgNCZQ07krS9KZTWyj/maSFP5hKidqRqrhs2qHGZDqUXU/OBZOrV06iSHwGMgImPt2FiNnDJ6mOhWGmNC6irqPGppv3WQErIJtk3EUYisGGOppVQAIexWiNn/ggL8CvEXKwDh963kC+eMjhsIU6v5Q6A8pFOLAPC+whZBAPAD4SrOvdEMgKQAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
  downloadMods(modsProgress);
  return;
};
const resourcepackClick = async () => {
  processingResourcepack.value = true;
  disableBackNav.value = true;

  resourcepackDisabled.value = true;
  resourcepackProgress.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAByklEQVRYhd2YTVLCQBCFX6dYqIsIztyHI7DjGpYuRV2ouNTyGGRFbgD3yRDMAlhQtIs4KfKHhEwS4rcKSaboN6+7pys0ncwwGPbhOnNGCxkM++Q6cxAzw3XmTETo9i6bjqsQS38NZsZg2CeaTmYMAJZFuO62S8j3co3dLkykDgD0bq6ih0LYzURVEKWCaOP9xSoUotEiLuxOeuUZsQm2EMKGUkF0z0q+dO4igOwYLVADkZiGAIv+gRIC0AHKHR+jh6fY7/H7a6Xr8ihdEFLK6NrzvMrX5UGuM+NuL2y/QtgnF/vnx1csqLwd1k5IKeF53slObIJt1LWW/qq8I0mklFBKHXxeBcYc0eQ58zh6BjNHQt/GL6X+J+7IOn2OmCK580KI6B6z6fmUzTui0c4opYw6oTFeI7p484pWCBFdZznx1/pjMdJ+s9rn3f0tgNCZQ07krS9KZTWyj/maSFP5hKidqRqrhs2qHGZDqUXU/OBZOrV06iSHwGMgImPt2FiNnDJ6mOhWGmNC6irqPGppv3WQErIJtk3EUYisGGOppVQAIexWiNn/ggL8CvEXKwDh963kC+eMjhsIU6v5Q6A8pFOLAPC+whZBAPAD4SrOvdEMgKQAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
  downloadResourcePack(resourcepackProgress);
  return;
};
</script>

<style scoped lang="sass">
.top-btn
  width: 100%
  // margin-bottom: 10px
  // height:
.bottom-btns
  width: 100%
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  gap: 5px

.bottom-btns > div
  width: 34%
.center
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
</style>
