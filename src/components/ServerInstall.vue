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
        :label="serverProgress.label"
        :progress="serverProgress.progress"
        :percent="serverProgress.percent"
        :img="serverProgress.img"
        :buttonClick="serverClick"
        :buttonDisabled="serverDisabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import MapProgress from 'src/components/MapProgress.vue';
import ProgressBox from 'src/components/ProgressBox.vue';
import {
  ProgressBox as ProgressBoxType,
  Shard,
  ShardsBox,
} from 'src/components/models';
import { downloadShards } from 'src/providers/DownloadShards';
import { extractShards } from 'src/providers/ExtractShards';
import { computeHash } from 'src/providers/GetHash';
import { getOldDirName } from 'src/providers/GetOldDirName';
import { installServer } from 'src/providers/InstallServer';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { useStateStore } from 'src/stores/StateStore';
import { ref } from 'vue';
const fs = require('fs');
const path = require('path');

const q = useQuasar();
const { map } = storeToRefs(useSourcesStore());
const { drehmalDir } = storeToRefs(useInstallerStore());
const { customConfig, processingShards, processingServer, disableBackNav } =
  storeToRefs(useStateStore());
const versionFileName = map.value.versionName
  .toLowerCase()
  .split(' ')
  .join('-');

const shardsPath = path.join(drehmalDir.value, 'installer', 'shards');

const shardsArr: Shard[] = [];
const downloadShardsLabel = ref('Download map');
let downloadShardsClicked = ref(false);

const shardsDisabled = ref(false);
const serverDisabled = ref(false);

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
  downloadLabel: 'Map Download - Press download button to begin...',
  downloadProgress: 0,
  downloadPercent: 0,

  totalExtractSize: map.value.uncompressedSizeInBytes / Math.pow(1024, 2),
  extractCount: 0,
  extracted: 0,
  extractLabel: 'Map Extract - Waiting for map download',
  extractProgress: 0,
  extractPercent: 0,

  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC',
});
const serverProgress = ref<ProgressBoxType>({
  label: 'Server - Press download button to begin...',
  percent: 0,
  progress: 0,
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVRYhd2YTU7bYBCGn7GyoF0Eu17EpyARS1hEogeI1IXbs/QAvUpJFogcAESkwhIBvQRUMna9ABaQr4tgk9j5lSd1zLNybI8y7ze/shx3z+j4bfq9gaGCdPy29HsDxBhDvzcwIoLtfCjbr5WIwkeMMXT8tshx98wAWJawbVdLyN/okeFwlEg1AOfTx/Sh69bL8WpFgiBODz68fxgJSUhEbNVrecsN4il+xnXrBEGc3rOyL226CJjuo4WU4Ik2Apa8AyUC1KDY+PD3TiZ+9y4+r9VuFoULouU56fXVbbh2u1kUFvL9aBeAH18uaXlOetKzTtjfO0GApudwfRvSLRiJBPUW1fIcru+iuc9TFMtTTch4ZJoNOxeZb/unDI2h5Tn8/hPx89eB1l8Dkp8jWkycPLDTsNN7yVqhh9FPrWzNfN0/xbxG4uYu4vBcMxJvFBayqLibDTu9Hpp8JBbZL4tK+53WPscjM68mZtmvikqNLGo+L+o1kUelRua5mURm3VhT0rZyGKOUWpaUv3iqrSjZJXAZRISuUjtWmyPZAbgMGt0qQX1FKYu1rSj/m5yQp/i5DD9WYpqPE6kVBDGuW6+EmPEvKPAqJLx/AEbft7IvbDKJ3zBKrfKHQHEkSS0BzLjCCiEA/wAmNq0sQ6WYFQAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC',
});

const serverClick = async () => {
  processingServer.value = true;
  disableBackNav.value = true;
  serverDisabled.value = true;
  serverProgress.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAAByklEQVRYhd2YTVLCQBCFX6dYqIsIztyHI7DjGpYuRV2ouNTyGGRFbgD3yRDMAlhQtIs4KfKHhEwS4rcKSaboN6+7pys0ncwwGPbhOnNGCxkM++Q6cxAzw3XmTETo9i6bjqsQS38NZsZg2CeaTmYMAJZFuO62S8j3co3dLkykDgD0bq6ih0LYzURVEKWCaOP9xSoUotEiLuxOeuUZsQm2EMKGUkF0z0q+dO4igOwYLVADkZiGAIv+gRIC0AHKHR+jh6fY7/H7a6Xr8ihdEFLK6NrzvMrX5UGuM+NuL2y/QtgnF/vnx1csqLwd1k5IKeF53slObIJt1LWW/qq8I0mklFBKHXxeBcYc0eQ58zh6BjNHQt/GL6X+J+7IOn2OmCK580KI6B6z6fmUzTui0c4opYw6oTFeI7p484pWCBFdZznx1/pjMdJ+s9rn3f0tgNCZQ07krS9KZTWyj/maSFP5hKidqRqrhs2qHGZDqUXU/OBZOrV06iSHwGMgImPt2FiNnDJ6mOhWGmNC6irqPGppv3WQErIJtk3EUYisGGOppVQAIexWiNn/ggL8CvEXKwDh963kC+eMjhsIU6v5Q6A8pFOLAPC+whZBAPAD4SrOvdEMgKQAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';

  installServer(serverProgress);
  return;
};

const shardsClick = async () => {
  if (downloadShardsClicked.value) return;
  shardsDisabled.value = true;
  processingShards.value = true;
  disableBackNav.value = true;

  downloadShardsClicked.value = true;
  downloadShardsLabel.value = 'Downloading';

  const mapDir = path.join(drehmalDir.value, 'world');
  const totalShards = map.value.shards.length;

  if (!fs.existsSync(shardsPath)) fs.mkdirSync(shardsPath, { recursive: true });
  // check if the world directory already, if so, move it and create a new directory
  if (fs.existsSync(mapDir)) {
    console.log(`Save exists, moving to "${getOldDirName(mapDir)}"`);
    fs.renameSync(mapDir, getOldDirName(mapDir));
  } else if (!fs.existsSync(mapDir)) fs.mkdirSync(mapDir, { recursive: true });
  console.log(`Downloading map shards to "${shardsPath}"`);
  console.log(`Extracting map to "${mapDir}"`);

  let state = 0;
  let downloaded = 0;
  let extracted = 0;

  map.value.shards.forEach((shard, index) => {
    const startTime = Date.now();
    const filePath = path.join(shardsPath, `${versionFileName}-${index}.zip`);

    downloadShards(shard, filePath, shardsProgress).then(async () => {
      downloaded++;
      const downloadTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(
        `Downloaded shard ${downloaded}/${totalShards} to "${filePath}" (${downloadTime}s elapsed)`
      );

      if (downloaded === totalShards)
        shardsProgress.value.downloadLabel = 'Map successfully downloaded!';

      const extractStart = Date.now();
      await extractShards(filePath, mapDir, shardsProgress);
      extracted++;
      const extractTime = ((Date.now() - extractStart) / 1000).toFixed(2);
      console.log(
        `Extracted shard ${extracted}/${totalShards}, removing "${filePath}" (in ${extractTime}s)`
      );

      fs.unlinkSync(filePath);

      if (extracted === totalShards) {
        shardsProgress.value.extractLabel = 'Validating map files...';
        const validateStart = Date.now();
        computeHash(mapDir, shardsProgress).then(async (mapHash) => {
          const hashMatch = mapHash.hash === map.value.hash;
          if (hashMatch) console.log(`Hash match! Got "${mapHash.hash}"`);
          else
            console.log(
              `Hash mismatch! Got "${mapHash.hash}" but expected "${map.value.hash}"`
            );
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(
            `Map downloaded and extracted complete! (${timeTaken}s total)`
          );

          const validateTime = ((Date.now() - validateStart) / 1000).toFixed(2);
          console.log(
            `Validating map files complete! (${validateTime}s total)`
          );

          if (customConfig.value) {
            // if using a custom config, display a popup with the hash result
            q.dialog({
              title: 'Map Validation',
              html: true,
              message:
                'Map validation complete! Send this to Major, please!' +
                `</br></br>Expected Hash: ${map.value.hash}` +
                `</br></br>Resulting Hash: ${mapHash.hash}` +
                `</br>Match: ${hashMatch}` +
                `</br>Time taken: ${timeTaken}s` +
                `</br>Validation time: ${validateTime}s`,
              persistent: true,
              dark: true,
            });
          }

          shardsProgress.value.extractLabel = 'Map validation complete!';
          processingShards.value = false;
        });
      }
    });
  });
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
  width: 100%
.center
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
</style>
