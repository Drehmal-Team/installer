<template>
  <div class="border-body">
    <q-layout view="hHh lpR fFf">
      <q-header>
        <div class="border-header">
          <div class="header">
            <img src="../assets/images/title-img.png" alt="" />
          </div>
        </div>
      </q-header>

      <q-page-container>
        <div class="body">
          <hr />
          <p>
            Welcome to the Drehmal v2.2: Apotheosis installer. This is designed
            to help set up all mods, saves, and resource packs you may need to
            play the greatest survival exploration experience in Minecraft!
          </p>
        </div>
      </q-page-container>

      <q-footer>
        <!-- don't touch these class names-->
        <div class="border-footer">
          <div class="footer">
            <!-- Footer Content -->
            <div class="nav-footer">
              <next-button path="/path/"></next-button>
            </div>
          </div>
        </div>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
// import { ipcRenderer } from 'electron';
import { storeToRefs } from 'pinia';
import NextButton from 'src/components/NextButton.vue';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
const path = require('path');
const { ipcRenderer } = require('electron');

// Ensure these are initialised; Be careful if removing
useSourcesStore();
useInstallerStore();

const {
  homeDir,
  appDir,
  minecraftDir,
  minecraftDirIsDefault,
  shardsDir,
  memory,
} = storeToRefs(useInstallerStore());

ipcRenderer.invoke('getAppDataPath').then((appData) => {
  homeDir.value = appData;
  appDir.value = path.join(appData, 'Drehmal Installer');
  minecraftDir.value = path.join(appData, '.minecraft');
  minecraftDirIsDefault.value = true;
  shardsDir.value = path.join(appDir.value, 'shards');
  memory.value = 4;

  console.log(
    'Defaults loaded: ',
    JSON.stringify({
      homeDir: homeDir.value,
      appDir: appDir.value,
      minecraftDir: minecraftDir.value,
      minecraftDirIsDefault: minecraftDirIsDefault.value,
      shardsDir: shardsDir.value,
      memory: memory.value,
    })
  );
});

/*
small-next-button-purple
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAOCSURBVFhH7ZlLaBNBGID/yW4eTTYxEbRFhVrtSUS8+apY0ZsgxWsPivakHvTitUVFCh6sNwXBs1gN2h70Ymx9gUYQQRH0oFQEldrmsUm6j6z/v9nUTdrspskmacCvGXYyO03mn3z7z2zCotFYmEksyvOufmAMQNMAAI/4aIe6hkdVyY9s6hWusMvDY7Ht23b2h8MdwFzUq71QlDykkjl4HX/xkE3em9YEwasHEokEjS7tw9xcCrS8BolEDtjk/WdaMOjVA/H4OOB9LqNb/ZwbeAmpeRmyigo3JvogFPEYZ5xBzqiQyyqQTIowP5eFkpE7GQixOSLA1rVBCHrcRouzuP2cUSvg7OgrQZdiEy5H22AYZjiPx1Ox3Lz4CU72T8HxA0/hzfSfknPMiMDHcXB+4BWcwn6DfTHIilDSr5pC47DDMhgOB+F2WyvSJXRAL6q0Meg3WpbSKfh03aiEvHxNHxKNwy4gy2CqmY0i1LWazM65ajfbbjwl2cwfLv0UeJ4Hl82b3x39DB+ez+oZ60cyCxr+qbiQnb20A/Yd7jJ6AVwdfAtiQoZfYg7SkqK3ZWUVbj0+CGuqzHKKokA+nzeeFUjNLiyfzeqhg+dQI2FRuUpzuD7ggy2Y5agINSpXCceCMUMDrNZQ2pQ4hWOamcmRcilUjvZNWM5UUO5nOgcZGZXDwDOk3CNr5ZqmmRkfKkcaUfbaYKEcZbke7NcTRuU89SvXkGDM6ANsknIN0cyMOcvljSy3dxnlfosLkJJkva1SlmuJZmbKs1wl1gW8i1kugMrVQsODKWcF6/CKabhmlK2OXeiF3Yf+qXX6yBTeGkj6zSJd/BxuHb7Oi3B9Yv/qy2Zm8L5JL2YogK04eaQeBeIUTdeskTREM9FQa0+ZWsk5CTejDLrDAeDw+A3VGrNRy0xLNKNrgYoZUou0omxFgRBlXermv2ZmiprR3qqQtTqNMya1cAvQHSmoNZPMwLUHtX25UZdmqqoaNXtoU0krvJlFtXDRLKpFfWrRi16fihWWwdA/S5JkPGstsizbBmOpWb2MnXgPmaQC31Gt0fFdEHL49YnmLZrGekj3NM7nrqWUBEPfELYTC+nS8bKJ8WnN73cD7+YgFApgU3EGaVpXfz2REOlXAEinJWDRO7ERBmw43Oa/AmjAhlg8HnfPfEmN43pytI4Jal0dwY3s0LuPT27/BQ2FAKlZsC2xAAAAAElFTkSuQmCC

small-next-button-grey
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAMGSURBVFhH7Zm7b9NAGMC/i+2kcZzE2RmZoCL9E7pSiYoOTDB2ZWklxKOo4aFKiIFKCKkTLGVAlEZAWYlUxIIygBAPITZmVBLbSRo7Nvc5Dlyi+JU4TSPll1i+xHfxfeefv7MdUiyWZNIkRZ6PzQMhAJYFAHRN35NQtui6ZZiFEyelDXJ3fbM0e2puXpaTQGJYa7IwDBOUagM+lN+/Insv9i1JStiB5HJpp8rkcHCggGVaUKk0gOztvrPS6YQdSHyGA34m5lQbnnsbm6BpNTBaLbixtgIpKeVsiQa91oJG3YBqVYM/B3Xo6nmUgSDZbAZychbigtD2PGIEkXNKbaLtvRtHdCp2aSbKdAR7IDTDCTiyLjzdfg6fP30Bk2aVi5cuQH5u1tkC8PDBFtRqddDo0mw27e9QucLtqyCFVE7XdTtz9aL8PuyvWS8cx3kGgkiiaKuU9uhcSkzadXBJxL1/zw3sBw6sF57B+DVmwZpBqhMyuNl+/fHUjOd5iMW8d/5y9w18//aD5nsDFE2jkxn4KofKIDptE0Y53Idpms6nNoE1CwMGnsu2VfJTTqZZDpf4gMq5EVkwLMHljJbINGMxjBZVTg2lHCq07qPckWnGwvNcaOWECJQbSTDjYiSasQTNcrU6TqzeWW4smrGwWS7joZyYZLKcz0TtxlQzFj/NdN2AxaWzcCb/X607t+6DplL1KHgkcGavVBW4fnP1+GUzFgtfPdeHcib971otzCWTH1PNWPpphhPhuaUFyPdTix4JPDJB1WIZi2a2VW5qOefIKJhqxtLRDCe6xfMLNGuddrb0V6uqqHBtbSWwWixDadait7iBoSmr97a2n1r9bn2DgO382noGg4079+7jxu0ZAIunZsOy9egx1Ol1l6KqsHrlMqRSorMlOo500kRME0d0ML3C0BUMPiEcGSOI5VDt7i95vbNviaIAvMBBJoMZprNXPGGPf7lS0fBfAFDVJpDis1KBAFmXJ/xfAAvIMimXy8Kvn8oOnU8Whxig8ZUp9JRc/vj17ZO/pGkNRRTwc1YAAAAASUVORK5CYII=

small-complete-button
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAATSSURBVFhH1Zl/bFNVFMe/r+3rj7d2a7cytzh0W2aQgQqMqJtDF9AQNTHGSKJRIyLRRP1HCDj/MCwizgRMjIIhEeMfRs0StInuD9SwhR9LRDo3RsdCYgyERAQZXX/udX1tvfe+2/WHbWn7GsY+2ck797zb7p17z7n33FfB5Rq2C3OCy2DQ9UAQgEQCALmSv8WgJ8g1psT7mtqsHwof7PpkeGX7qh673QJBR3stLhQljoBfxu/ukR+Fwe+PJ6xWE3PE4bDxLosHrzeARDwBn0+GMPjDiYTNZmKOGM16GMw63q18tvQc41puQlEFAyMbeKt8ouEY5FkFfn8IM95ZZDx5JRyhtNXaCoqB5mYFECU911QyZkayi9xcPAf7p+A+eY23VD79tpNrBJasqprUFZK02174TbURqPn13uVYu86pGkogMB3JPTO5EMgoGo3GvNJgsqDZKKGFCL2GfVHYl0gpcf5fd9ZXodWUkiWCiaxKupzfnxT6HDei4Mzo9XomuTiw+yzCIQWrO5xobJS4FfBHoujc0MBb+Zk8Oc01MlMkgf8Y/RfTVyNoarHiudfa+J1MotEoW4rTKXpmCo2G/5yMy6NBSA4RK7rr5qUYRyjpn7nvYSdMYR1mzszCM5pyMpsbzU7ZGW/Q6aCvUCJTRL2OfKfA8qdcKrN8VZDMICqNW8qZGMkdLRRcAAwGA3QknNJ5setXRJQYDv28HjUOI7eWjmf0OtdUlrZa2fdNjXmx500321hdpx/nd1UURUE8HuctlZKW5mzopldlLH0/yubLdydx6B0Pk/3bJzDJnbMY9Ox/lJOPCxZmDrMRdi42o4FbtXFTnaEh9BIJ083dR0m4JHBhJoS3v16Dvb90o+vR4pb0QtxUZySRhFCdDc32Km6pLJqd2U8qgZcfO5oh2Xy+x4NXNg7h451n2Jnq/HQAO77pwGeD61BdRj2YD83O3Caa0UJrLLMqIVKbZVMvmnCnKKFWpz64EouhqkaEzV5czVUsmp3pfLoRm3rvwiPPN7FRp4+2t3dsXvb1jmNq3Mv6xusE1ndb/yrWrjTlOZM2mE13W1l91XxPNWsvc9bA75Hhm5ARmJQxMzELxRdj9+JmtSYrtn4rlZI3zSRvPHkM3usRvLX7XjxEVqJ//grjyBcX2L2Lk+pRlh7FlVgczqUWtiHGnAJe3b6c9cnmwHtncXr4Ku5YacP7B+/n1kwqvmkmabFbcbstVfo3tErY3N/OhDpCodfZaAxrn21g9nyOUOqrzGyVW9DarHLpqx3NzuQayb7BB+dlH9kQaRgWi5bBKZgzdNkUxdz7wPlTXsiRGEbpCfGKzK0qOz5azbX80JUunfkTq0XAio5abk1BT5g0Z8o+adIPzs3N8VYmyx5wsBOiJOvZypWUU0NXeI/CpH/mb3JitSRPrDkcoeQ6Mmej+e3MiYHLuOgJklmkzoPUW0E8s6WZ6SxkuJ2paTE05ro2b5fJiHdtakD7GodqKIH0mdHsTC52PpF6jZSLS74wvhtZz1vayBtm9A1hJUiW9vmkUq+0I8HM5xV+Onw8IUkiDKSira6m1WwyLul/vPV1ny9EfwVAMDgHwTUw3CdA2GVf5L8CkHpjq+B2u8VLfwYOk7LlKQ0DtHA6gRQaW8fPDX31H9XaPbywB8j8AAAAAElFTkSuQmCC

*/
</script>

<style scoped>
.body {
  font-size: 18px;
}
hr {
  height: 5px;
}
.small-purple-next {
  background: url('src/assets/images/small-next-button-purple.png');
}
.small-grey-next {
  background: url('src/assets/images/small-next-button-grey.png');
}
.small-complete-button {
  background: url('src/assets/images/small-complete-button.png');
}
</style>
