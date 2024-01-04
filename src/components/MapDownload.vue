<template>
  <div>
    <div class="downloads-page">
      <div class="downloads-left">
        <!-- Col1 -->
        <div class="shards-background">
          <div class="shards-download">
            <div
              v-for="shard in shards"
              :key="shard.index"
              class="progress-div"
            >
              <mini-progress-bar
                :index="shard.index"
                :progress="shard.progress"
                :percent="shard.percent"
                :label="shard.label"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="downloads-right">
        <!-- Col2 -->
        <div>
          <q-btn
            size="20px"
            color="info"
            @click="downloadShards"
            :label="downloadShardsLabel"
            class="shards-btn"
            :class="{ disabled: shardsDisabled }"
          />
        </div>
        <div>
          <!-- Fabric download, install -->
          <progress-box
            :label="fabricProgress.label"
            :progress="fabricProgress.progress"
            :percent="fabricProgress.percent"
            :img="fabricProgress.img"
            :buttonClick="fabricClick"
            :buttonDisabled="fabricDisabled"
          />
        </div>
        <div>
          <!-- Mods download -->
          <progress-box
            :label="modsProgress.label"
            :progress="modsProgress.progress"
            :percent="modsProgress.percent"
            :img="modsProgress.img"
            :buttonClick="modsClick"
            :buttonDisabled="modsDisabled"
          />
        </div>
      </div>
    </div>

    <!-- <progress-bar></progress-bar> -->
  </div>
</template>

<script setup lang="ts">
import log from 'electron-log';
import { storeToRefs } from 'pinia';
import MiniProgressBar from 'src/components/MiniProgressBar.vue';
import ProgressBox from 'src/components/ProgressBox.vue';
import { ProgressBox as ProgressBoxType, Shard } from 'src/components/models';
import { downloadFile } from 'src/providers/DownloadFile';
import { extractTargz } from 'src/providers/ExtractFile';
import {
  downloadMods,
  downloadResourcePack,
  installFabric,
} from 'src/providers/InstallFabric';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { useStateStore } from 'src/stores/StateStore';
import { ref } from 'vue';
const fs = require('fs');
const path = require('path');

const { map } = storeToRefs(useSourcesStore());
const { minecraftDir, shardsDir } = storeToRefs(useInstallerStore());
const {
  processingShards,
  processingFabric,
  processingMods,
  disableNav,
  disableBackNav,
  disableNextNav,
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

map.value.shards.forEach((shard, i) =>
  shardsArr.push({
    index: i,
    name: `${versionFileName}-${i}.tar.gz`,
    label: 'Waiting. . .',
    progress: 0,
    percent: 0,
    url: shard,
  })
);
const shards = ref<Shard[]>(shardsArr);
const fabricProgress = ref<ProgressBoxType>({
  label: 'Fabric - Waiting . . .',
  percent: 0,
  progress: 0,
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC',
});
const modsProgress = ref<ProgressBoxType>({
  label: 'Mods - Waiting . . .',
  percent: 0,
  progress: 0,
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC',
});

const downloadShards = async () => {
  if (downloadShardsClicked.value) return;
  shardsDisabled.value = true;
  processingShards.value = true;
  disableBackNav.value = true;

  downloadShardsClicked.value = true;
  downloadShardsLabel.value = 'Downloading';
  let downloaded = 0;
  let extracted = 0;

  const mapDir = path.join(minecraftDir.value, 'saves', map.value.versionName);
  if (!fs.existsSync(shardsDir.value))
    fs.mkdirSync(shardsDir.value, { recursive: true });

  for (const shard of shards.value) {
    const { index, url } = shard;
    const shardRef = ref(shard);
    const filePath = path.join(
      shardsDir.value,
      `${versionFileName}-${index}.tar.gz`
    );
    log.info(`Downloading map shard to ${filePath}`);
    downloadFile(url, filePath, shardRef).then(() => {
      downloaded++;
      if (downloaded === map.value.shards.length)
        downloadShardsLabel.value = 'Extracting';

      if (!fs.existsSync(mapDir)) fs.mkdirSync(mapDir, { recursive: true });
      shardRef.value.label = 'Extracting files. . .';

      log.info(`Extracting map to ${mapDir}`);
      extractTargz(filePath, mapDir, shardRef).then(() => {
        extracted++;

        if (extracted === map.value.shards.length) {
          downloadShardsLabel.value = 'Complete!';
          processingShards.value = false;
          downloadResourcePack(mapDir);
        }
      });
    });
  }
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
</script>

<style scoped>
.downloads-page {
  display: flex;
  flex-direction: row;
  /* height: 100%; */
}
.downloads-left {
  width: 70%;
  height: 100%;
}
.shards-background {
  background: url('src/assets/images/map-shards-bg.png') no-repeat;
  margin-top: 5px;
  margin-left: 10px;
  /* height: 1vh; */
}
.shards-download {
  /* padding: 2px; */
  padding-left: 60px;
  padding-top: 55px;
  width: 580px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 398px;
  /* 70 wide 100 tall */
}
.downloads-right {
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 55px 0px;

  /* height: 100%; */
}
.shards-btn {
  /* position: absolute;
  top: 115px;
  left: 300px; */
  /* top: +10px; */
  width: 240px;
}
</style>
