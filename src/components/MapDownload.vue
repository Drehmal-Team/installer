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
import { ref } from 'vue';
const fs = require('fs');
const path = require('path');

const { map } = storeToRefs(useSourcesStore());
const { minecraftDir, shardsDir } = storeToRefs(useInstallerStore());

const versionFileName = map.value.versionName
  .toLowerCase()
  .split(' ')
  .join('-');

const shardsArr: Shard[] = [];
const downloadShardsLabel = ref('Download map');
let downloadShardsClicked = ref(false);

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
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAOCSURBVFhH7ZlLaBNBGID/yW4eTTYxEbRFhVrtSUS8+apY0ZsgxWsPivakHvTitUVFCh6sNwXBs1gN2h70Ymx9gUYQQRH0oFQEldrmsUm6j6z/v9nUTdrspskmacCvGXYyO03mn3z7z2zCotFYmEksyvOufmAMQNMAAI/4aIe6hkdVyY9s6hWusMvDY7Ht23b2h8MdwFzUq71QlDykkjl4HX/xkE3em9YEwasHEokEjS7tw9xcCrS8BolEDtjk/WdaMOjVA/H4OOB9LqNb/ZwbeAmpeRmyigo3JvogFPEYZ5xBzqiQyyqQTIowP5eFkpE7GQixOSLA1rVBCHrcRouzuP2cUSvg7OgrQZdiEy5H22AYZjiPx1Ox3Lz4CU72T8HxA0/hzfSfknPMiMDHcXB+4BWcwn6DfTHIilDSr5pC47DDMhgOB+F2WyvSJXRAL6q0Meg3WpbSKfh03aiEvHxNHxKNwy4gy2CqmY0i1LWazM65ajfbbjwl2cwfLv0UeJ4Hl82b3x39DB+ez+oZ60cyCxr+qbiQnb20A/Yd7jJ6AVwdfAtiQoZfYg7SkqK3ZWUVbj0+CGuqzHKKokA+nzeeFUjNLiyfzeqhg+dQI2FRuUpzuD7ggy2Y5agINSpXCceCMUMDrNZQ2pQ4hWOamcmRcilUjvZNWM5UUO5nOgcZGZXDwDOk3CNr5ZqmmRkfKkcaUfbaYKEcZbke7NcTRuU89SvXkGDM6ANsknIN0cyMOcvljSy3dxnlfosLkJJkva1SlmuJZmbKs1wl1gW8i1kugMrVQsODKWcF6/CKabhmlK2OXeiF3Yf+qXX6yBTeGkj6zSJd/BxuHb7Oi3B9Yv/qy2Zm8L5JL2YogK04eaQeBeIUTdeskTREM9FQa0+ZWsk5CTejDLrDAeDw+A3VGrNRy0xLNKNrgYoZUou0omxFgRBlXermv2ZmiprR3qqQtTqNMya1cAvQHSmoNZPMwLUHtX25UZdmqqoaNXtoU0krvJlFtXDRLKpFfWrRi16fihWWwdA/S5JkPGstsizbBmOpWb2MnXgPmaQC31Gt0fFdEHL49YnmLZrGekj3NM7nrqWUBEPfELYTC+nS8bKJ8WnN73cD7+YgFApgU3EGaVpXfz2REOlXAEinJWDRO7ERBmw43Oa/AmjAhlg8HnfPfEmN43pytI4Jal0dwY3s0LuPT27/BQ2FAKlZsC2xAAAAAElFTkSuQmCC',
});
const modsProgress = ref<ProgressBoxType>({
  label: 'Mods - Waiting . . .',
  percent: 0,
  progress: 0,
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAOCSURBVFhH7ZlLaBNBGID/yW4eTTYxEbRFhVrtSUS8+apY0ZsgxWsPivakHvTitUVFCh6sNwXBs1gN2h70Ymx9gUYQQRH0oFQEldrmsUm6j6z/v9nUTdrspskmacCvGXYyO03mn3z7z2zCotFYmEksyvOufmAMQNMAAI/4aIe6hkdVyY9s6hWusMvDY7Ht23b2h8MdwFzUq71QlDykkjl4HX/xkE3em9YEwasHEokEjS7tw9xcCrS8BolEDtjk/WdaMOjVA/H4OOB9LqNb/ZwbeAmpeRmyigo3JvogFPEYZ5xBzqiQyyqQTIowP5eFkpE7GQixOSLA1rVBCHrcRouzuP2cUSvg7OgrQZdiEy5H22AYZjiPx1Ox3Lz4CU72T8HxA0/hzfSfknPMiMDHcXB+4BWcwn6DfTHIilDSr5pC47DDMhgOB+F2WyvSJXRAL6q0Meg3WpbSKfh03aiEvHxNHxKNwy4gy2CqmY0i1LWazM65ajfbbjwl2cwfLv0UeJ4Hl82b3x39DB+ez+oZ60cyCxr+qbiQnb20A/Yd7jJ6AVwdfAtiQoZfYg7SkqK3ZWUVbj0+CGuqzHKKokA+nzeeFUjNLiyfzeqhg+dQI2FRuUpzuD7ggy2Y5agINSpXCceCMUMDrNZQ2pQ4hWOamcmRcilUjvZNWM5UUO5nOgcZGZXDwDOk3CNr5ZqmmRkfKkcaUfbaYKEcZbke7NcTRuU89SvXkGDM6ANsknIN0cyMOcvljSy3dxnlfosLkJJkva1SlmuJZmbKs1wl1gW8i1kugMrVQsODKWcF6/CKabhmlK2OXeiF3Yf+qXX6yBTeGkj6zSJd/BxuHb7Oi3B9Yv/qy2Zm8L5JL2YogK04eaQeBeIUTdeskTREM9FQa0+ZWsk5CTejDLrDAeDw+A3VGrNRy0xLNKNrgYoZUou0omxFgRBlXermv2ZmiprR3qqQtTqNMya1cAvQHSmoNZPMwLUHtX25UZdmqqoaNXtoU0krvJlFtXDRLKpFfWrRi16fihWWwdA/S5JkPGstsizbBmOpWb2MnXgPmaQC31Gt0fFdEHL49YnmLZrGekj3NM7nrqWUBEPfELYTC+nS8bKJ8WnN73cD7+YgFApgU3EGaVpXfz2REOlXAEinJWDRO7ERBmw43Oa/AmjAhlg8HnfPfEmN43pytI4Jal0dwY3s0LuPT27/BQ2FAKlZsC2xAAAAAElFTkSuQmCC',
});

const downloadShards = async () => {
  if (downloadShardsClicked.value) return;

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
          downloadResourcePack(mapDir);
        }
      });
    });
  }
};

const fabricClick = async () => {
  fabricProgress.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAMGSURBVFhH7Zm7b9NAGMC/i+2kcZzE2RmZoCL9E7pSiYoOTDB2ZWklxKOo4aFKiIFKCKkTLGVAlEZAWYlUxIIygBAPITZmVBLbSRo7Nvc5Dlyi+JU4TSPll1i+xHfxfeefv7MdUiyWZNIkRZ6PzQMhAJYFAHRN35NQtui6ZZiFEyelDXJ3fbM0e2puXpaTQGJYa7IwDBOUagM+lN+/Insv9i1JStiB5HJpp8rkcHCggGVaUKk0gOztvrPS6YQdSHyGA34m5lQbnnsbm6BpNTBaLbixtgIpKeVsiQa91oJG3YBqVYM/B3Xo6nmUgSDZbAZychbigtD2PGIEkXNKbaLtvRtHdCp2aSbKdAR7IDTDCTiyLjzdfg6fP30Bk2aVi5cuQH5u1tkC8PDBFtRqddDo0mw27e9QucLtqyCFVE7XdTtz9aL8PuyvWS8cx3kGgkiiaKuU9uhcSkzadXBJxL1/zw3sBw6sF57B+DVmwZpBqhMyuNl+/fHUjOd5iMW8d/5y9w18//aD5nsDFE2jkxn4KofKIDptE0Y53Idpms6nNoE1CwMGnsu2VfJTTqZZDpf4gMq5EVkwLMHljJbINGMxjBZVTg2lHCq07qPckWnGwvNcaOWECJQbSTDjYiSasQTNcrU6TqzeWW4smrGwWS7joZyYZLKcz0TtxlQzFj/NdN2AxaWzcCb/X607t+6DplL1KHgkcGavVBW4fnP1+GUzFgtfPdeHcib971otzCWTH1PNWPpphhPhuaUFyPdTix4JPDJB1WIZi2a2VW5qOefIKJhqxtLRDCe6xfMLNGuddrb0V6uqqHBtbSWwWixDadait7iBoSmr97a2n1r9bn2DgO382noGg4079+7jxu0ZAIunZsOy9egx1Ol1l6KqsHrlMqRSorMlOo500kRME0d0ML3C0BUMPiEcGSOI5VDt7i95vbNviaIAvMBBJoMZprNXPGGPf7lS0fBfAFDVJpDis1KBAFmXJ/xfAAvIMimXy8Kvn8oOnU8Whxig8ZUp9JRc/vj17ZO/pGkNRRTwc1YAAAAASUVORK5CYII=';
  installFabric(fabricProgress);
  return;
};
const modsClick = async () => {
  modsProgress.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAMGSURBVFhH7Zm7b9NAGMC/i+2kcZzE2RmZoCL9E7pSiYoOTDB2ZWklxKOo4aFKiIFKCKkTLGVAlEZAWYlUxIIygBAPITZmVBLbSRo7Nvc5Dlyi+JU4TSPll1i+xHfxfeefv7MdUiyWZNIkRZ6PzQMhAJYFAHRN35NQtui6ZZiFEyelDXJ3fbM0e2puXpaTQGJYa7IwDBOUagM+lN+/Insv9i1JStiB5HJpp8rkcHCggGVaUKk0gOztvrPS6YQdSHyGA34m5lQbnnsbm6BpNTBaLbixtgIpKeVsiQa91oJG3YBqVYM/B3Xo6nmUgSDZbAZychbigtD2PGIEkXNKbaLtvRtHdCp2aSbKdAR7IDTDCTiyLjzdfg6fP30Bk2aVi5cuQH5u1tkC8PDBFtRqddDo0mw27e9QucLtqyCFVE7XdTtz9aL8PuyvWS8cx3kGgkiiaKuU9uhcSkzadXBJxL1/zw3sBw6sF57B+DVmwZpBqhMyuNl+/fHUjOd5iMW8d/5y9w18//aD5nsDFE2jkxn4KofKIDptE0Y53Idpms6nNoE1CwMGnsu2VfJTTqZZDpf4gMq5EVkwLMHljJbINGMxjBZVTg2lHCq07qPckWnGwvNcaOWECJQbSTDjYiSasQTNcrU6TqzeWW4smrGwWS7joZyYZLKcz0TtxlQzFj/NdN2AxaWzcCb/X607t+6DplL1KHgkcGavVBW4fnP1+GUzFgtfPdeHcib971otzCWTH1PNWPpphhPhuaUFyPdTix4JPDJB1WIZi2a2VW5qOefIKJhqxtLRDCe6xfMLNGuddrb0V6uqqHBtbSWwWixDadait7iBoSmr97a2n1r9bn2DgO382noGg4079+7jxu0ZAIunZsOy9egx1Ol1l6KqsHrlMqRSorMlOo500kRME0d0ML3C0BUMPiEcGSOI5VDt7i95vbNviaIAvMBBJoMZprNXPGGPf7lS0fBfAFDVJpDis1KBAFmXJ/xfAAvIMimXy8Kvn8oOnU8Whxig8ZUp9JRc/vj17ZO/pGkNRRTwc1YAAAAASUVORK5CYII=';
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
