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
          />
        </div>
      </div>
    </div>

    <!-- <progress-bar></progress-bar> -->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MiniProgressBar from 'src/components/MiniProgressBar.vue';
import ProgressBox from 'src/components/ProgressBox.vue';
import { ProgressBox as ProgressBoxType, Shard } from 'src/components/models';
import { downloadFile } from 'src/providers/DownloadFile';
import { extractTargz } from 'src/providers/ExtractFile';
import { downloadMods, installFabric } from 'src/providers/InstallFabric';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { ref } from 'vue';
const fs = require('fs');
// const https = require('https');
const path = require('path');

const { map, mods, resourcePack } = storeToRefs(useSourcesStore());
const {
  homeDir,
  appDir,
  memory,
  minecraftDir,
  minecraftDirIsDefault,
  shardsDir,
} = storeToRefs(useInstallerStore());

const versionFileName = map.value.versionName
  .toLowerCase()
  .split(' ')
  .join('-');

const shardsArr: Shard[] = [];
const downloadShardsLabel = ref('Download map');
let downloadShardsClicked = ref(false);
// const homeDir =
//   process.platform === 'win32' ? (process.env.APPDATA as string) : os.homedir();
// const shardsPath = path.join(homeDir, 'Drehmal Installer', 'shards');

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
  img: 'src/assets/small-next-button-purple.png',
  // imgSrc: 'src/assets/small-next-button-grey.png',
});
const modsProgress = ref<ProgressBoxType>({
  label: 'Mods - Waiting . . .',
  percent: 0,
  progress: 0,
  img: 'src/assets/small-next-button-purple.png',
  // imgSrc: 'src/assets/small-next-button-grey.png',
});

const downloadShards = async () => {
  if (downloadShardsClicked.value) return;

  downloadShardsClicked.value = true;
  downloadShardsLabel.value = 'Downloading';

  const mapDir = path.join(minecraftDir.value, 'saves', map.value.versionName);
  async function processArray(shards: Shard[]): Promise<void> {
    for (const shard of shards) {
      const { index, url } = shard;
      const shardRef = ref(shard);
      const filePath = path.join(
        shardsDir.value,
        `${versionFileName}-${index}.tar.gz`
      );
      downloadFile(url, filePath, shardRef).then(() => {
        if (!fs.existsSync(mapDir)) fs.mkdirSync(mapDir, { recursive: true });
        shardRef.value.label = 'Extracting files. . .';
        console.log(`Created save dir at ${mapDir}`);
        // TODO: DECROMPRESS FILES
        console.log(`Attemping tarball extract for ${filePath}`);
        extractTargz(filePath, mapDir, shardRef);
      });
    }
  }
  await processArray(shards.value);
};

const fabricClick = async () => {
  fabricProgress.value.img = 'src/assets/small-next-button-grey.png';
  installFabric(fabricProgress);
  return;
};
const modsClick = async () => {
  modsProgress.value.img = 'src/assets/small-next-button-grey.png';
  downloadMods(modsProgress);
  return;
};

const getImage = (image: string) => {
  return require(image);
};
// const installFabric = () => {
//   const { label, percent, progress } = fabricProgress.value;
//   if (progress === 1) {
//     fabricProgress.value.progress = 0;
//     fabricProgress.value.label = 'Fabric - Waiting . . .';
//   } else if (progress >= 0.67) {
//     fabricProgress.value.progress = 1;
//     fabricProgress.value.label = 'Fabric - Complete!';
//   } else if (progress >= 0.33) {
//     fabricProgress.value.progress = 0.67;
//     fabricProgress.value.label = 'Fabric - Downloading . . .';
//   } else {
//     fabricProgress.value.progress = 0.33;
//     fabricProgress.value.label = 'Fabric - Started . . .';
//   }
// };
// const downloadMods = () => {
//   const { label, percent, progress } = modsProgress.value;
//   modsProgress.value.progress = progress === 1 ? 0 : 1;
// };
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
  background: url('src/assets/map-shards-bg.png') no-repeat;
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
.progress-div {
  /* display: block; */
  /* padding-bottom: 1px; */
  /* gap: 1px; */
  /* margin: 2px; */
  /* margin-bottom: 2px; */
  /* background-color: grey; */
}
</style>
