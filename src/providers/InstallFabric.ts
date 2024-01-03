import log from 'electron-log';
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

export async function installFabric(ref: Ref) {
  const startTime = Date.now();

  const { launcher, map } = storeToRefs(useSourcesStore());
  const { homeDir, minecraftDir, memory } = storeToRefs(useInstallerStore());

  const fabricPath = path.join(
    homeDir.value,
    'Drehmal Installer',
    'fabric-installer-' + launcher.value.fabric.version + '.jar'
  );

  log.info(`Downloading Fabric installer to ${fabricPath}`);

  ref.value.label = 'Downloading Fabric installer';
  ref.value.progress = 0.25;
  ref.value.percent = 25;
  downloadFile(launcher.value.fabric.source, fabricPath).then(() => {
    ref.value.label = 'Installing Fabric';
    ref.value.progress = 0.5;
    ref.value.percent = 50;
    log.info('Calling Fabric installer');
    const fabricProc = spawn('java', [
      '-jar',
      fabricPath,
      'client',
      '-dir',
      minecraftDir.value,
      '-mcversion',
      '1.17.1',
    ]);
    fabricProc.stdout.on('data', (data: any) => {
      log.info(`stdout: ${data}`);
    });
    fabricProc.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data}`);
    });

    fabricProc.on('close', (code: any) => {
      const taken = Date.now() - startTime;
      log.info(`child process exited with code ${code} in ${taken}ms`);
      fs.unlinkSync(fabricPath);

      ref.value.label = 'Fabric successfully installed!';
      ref.value.progress = 0.67;
      ref.value.percent = 67;

      const profileFilePath = path.join(
        minecraftDir.value,
        'launcher_profiles.json'
      );

      // TODO: edit fabric launcher profile
      const data = JSON.parse(
        fs.readFileSync(profileFilePath, 'utf-8') as string
      );

      data['profiles'][map.value.versionName] = JSON.parse(
        JSON.stringify(data['profiles']['fabric-loader-1.17.1'])
      );

      data['profiles'][map.value.versionName]['name'] = map.value.versionName;
      data['profiles'][map.value.versionName]['icon'] =
        launcher.value.launcher_icon; // in base64
      data['profiles'][map.value.versionName][
        'javaArgs'
      ] = `-Xmx${memory.value}G`;

      fs.writeFileSync(profileFilePath, JSON.stringify(data), 'utf-8');
      log.info('readFileSync complete');

      ref.value.label = 'Minecraft profile created!';
      ref.value.progress = 1;
      ref.value.percent = 100;
      ref.value.img =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAATSSURBVFhH1Zl/bFNVFMe/r+3rj7d2a7cytzh0W2aQgQqMqJtDF9AQNTHGSKJRIyLRRP1HCDj/MCwizgRMjIIhEeMfRs0StInuD9SwhR9LRDo3RsdCYgyERAQZXX/udX1tvfe+2/WHbWn7GsY+2ck797zb7p17z7n33FfB5Rq2C3OCy2DQ9UAQgEQCALmSv8WgJ8g1psT7mtqsHwof7PpkeGX7qh673QJBR3stLhQljoBfxu/ukR+Fwe+PJ6xWE3PE4bDxLosHrzeARDwBn0+GMPjDiYTNZmKOGM16GMw63q18tvQc41puQlEFAyMbeKt8ouEY5FkFfn8IM95ZZDx5JRyhtNXaCoqB5mYFECU911QyZkayi9xcPAf7p+A+eY23VD79tpNrBJasqprUFZK02174TbURqPn13uVYu86pGkogMB3JPTO5EMgoGo3GvNJgsqDZKKGFCL2GfVHYl0gpcf5fd9ZXodWUkiWCiaxKupzfnxT6HDei4Mzo9XomuTiw+yzCIQWrO5xobJS4FfBHoujc0MBb+Zk8Oc01MlMkgf8Y/RfTVyNoarHiudfa+J1MotEoW4rTKXpmCo2G/5yMy6NBSA4RK7rr5qUYRyjpn7nvYSdMYR1mzszCM5pyMpsbzU7ZGW/Q6aCvUCJTRL2OfKfA8qdcKrN8VZDMICqNW8qZGMkdLRRcAAwGA3QknNJ5setXRJQYDv28HjUOI7eWjmf0OtdUlrZa2fdNjXmx500321hdpx/nd1UURUE8HuctlZKW5mzopldlLH0/yubLdydx6B0Pk/3bJzDJnbMY9Ox/lJOPCxZmDrMRdi42o4FbtXFTnaEh9BIJ083dR0m4JHBhJoS3v16Dvb90o+vR4pb0QtxUZySRhFCdDc32Km6pLJqd2U8qgZcfO5oh2Xy+x4NXNg7h451n2Jnq/HQAO77pwGeD61BdRj2YD83O3Caa0UJrLLMqIVKbZVMvmnCnKKFWpz64EouhqkaEzV5czVUsmp3pfLoRm3rvwiPPN7FRp4+2t3dsXvb1jmNq3Mv6xusE1ndb/yrWrjTlOZM2mE13W1l91XxPNWsvc9bA75Hhm5ARmJQxMzELxRdj9+JmtSYrtn4rlZI3zSRvPHkM3usRvLX7XjxEVqJ//grjyBcX2L2Lk+pRlh7FlVgczqUWtiHGnAJe3b6c9cnmwHtncXr4Ku5YacP7B+/n1kwqvmkmabFbcbstVfo3tErY3N/OhDpCodfZaAxrn21g9nyOUOqrzGyVW9DarHLpqx3NzuQayb7BB+dlH9kQaRgWi5bBKZgzdNkUxdz7wPlTXsiRGEbpCfGKzK0qOz5azbX80JUunfkTq0XAio5abk1BT5g0Z8o+adIPzs3N8VYmyx5wsBOiJOvZypWUU0NXeI/CpH/mb3JitSRPrDkcoeQ6Mmej+e3MiYHLuOgJklmkzoPUW0E8s6WZ6SxkuJ2paTE05ro2b5fJiHdtakD7GodqKIH0mdHsTC52PpF6jZSLS74wvhtZz1vayBtm9A1hJUiW9vmkUq+0I8HM5xV+Onw8IUkiDKSira6m1WwyLul/vPV1ny9EfwVAMDgHwTUw3CdA2GVf5L8CkHpjq+B2u8VLfwYOk7LlKQ0DtHA6gRQaW8fPDX31H9XaPbywB8j8AAAAAElFTkSuQmCC';
    });
  });
}
export async function downloadMods(ref: Ref) {
  const startTime = Date.now();

  const { launcher } = storeToRefs(useSourcesStore());
  const { minecraftDir } = storeToRefs(useInstallerStore());

  const modList = launcher.value.modList;
  const modLoader = launcher.value.fabric.name;
  const totalMods = modList.length;
  let downloaded = 0;

  const modsPath = path.join(minecraftDir.value, 'mods');
  if (!fs.existsSync(modsPath)) fs.mkdirSync(modsPath, { recursive: true });

  async function processArray(mods: typeof modList): Promise<void> {
    for (const mod of mods) {
      const { name, mod_version, mc_version, source } = mod;
      const modName =
        name + ' - ' + modLoader + mod_version + '-' + mc_version + '.jar';
      log.info(`Downloading ${modName} to ${modsPath}`);
      const modPath = path.join(modsPath, modName);
      await downloadFile(source, modPath);
      downloaded++;
      const progress = downloaded / totalMods;
      const percent = (progress * 100).toFixed(1);

      ref.value.progress = progress;
      ref.value.percent = percent;
      // Note: Roughly 21 character limit, consider truncating mod name
      ref.value.label = `Downloading: ${name}`;

      const taken = Date.now() - startTime;
      log.info(`downloaded mod ${downloaded}/${totalMods} in ${taken}ms`);
    }
  }
  await processArray(modList);
  ref.value.label = 'Mods successfully downloaded!';
  ref.value.img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAhCAYAAAB0v5O6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAATSSURBVFhH1Zl/bFNVFMe/r+3rj7d2a7cytzh0W2aQgQqMqJtDF9AQNTHGSKJRIyLRRP1HCDj/MCwizgRMjIIhEeMfRs0StInuD9SwhR9LRDo3RsdCYgyERAQZXX/udX1tvfe+2/WHbWn7GsY+2ck797zb7p17z7n33FfB5Rq2C3OCy2DQ9UAQgEQCALmSv8WgJ8g1psT7mtqsHwof7PpkeGX7qh673QJBR3stLhQljoBfxu/ukR+Fwe+PJ6xWE3PE4bDxLosHrzeARDwBn0+GMPjDiYTNZmKOGM16GMw63q18tvQc41puQlEFAyMbeKt8ouEY5FkFfn8IM95ZZDx5JRyhtNXaCoqB5mYFECU911QyZkayi9xcPAf7p+A+eY23VD79tpNrBJasqprUFZK02174TbURqPn13uVYu86pGkogMB3JPTO5EMgoGo3GvNJgsqDZKKGFCL2GfVHYl0gpcf5fd9ZXodWUkiWCiaxKupzfnxT6HDei4Mzo9XomuTiw+yzCIQWrO5xobJS4FfBHoujc0MBb+Zk8Oc01MlMkgf8Y/RfTVyNoarHiudfa+J1MotEoW4rTKXpmCo2G/5yMy6NBSA4RK7rr5qUYRyjpn7nvYSdMYR1mzszCM5pyMpsbzU7ZGW/Q6aCvUCJTRL2OfKfA8qdcKrN8VZDMICqNW8qZGMkdLRRcAAwGA3QknNJ5setXRJQYDv28HjUOI7eWjmf0OtdUlrZa2fdNjXmx500321hdpx/nd1UURUE8HuctlZKW5mzopldlLH0/yubLdydx6B0Pk/3bJzDJnbMY9Ox/lJOPCxZmDrMRdi42o4FbtXFTnaEh9BIJ083dR0m4JHBhJoS3v16Dvb90o+vR4pb0QtxUZySRhFCdDc32Km6pLJqd2U8qgZcfO5oh2Xy+x4NXNg7h451n2Jnq/HQAO77pwGeD61BdRj2YD83O3Caa0UJrLLMqIVKbZVMvmnCnKKFWpz64EouhqkaEzV5czVUsmp3pfLoRm3rvwiPPN7FRp4+2t3dsXvb1jmNq3Mv6xusE1ndb/yrWrjTlOZM2mE13W1l91XxPNWsvc9bA75Hhm5ARmJQxMzELxRdj9+JmtSYrtn4rlZI3zSRvPHkM3usRvLX7XjxEVqJ//grjyBcX2L2Lk+pRlh7FlVgczqUWtiHGnAJe3b6c9cnmwHtncXr4Ku5YacP7B+/n1kwqvmkmabFbcbstVfo3tErY3N/OhDpCodfZaAxrn21g9nyOUOqrzGyVW9DarHLpqx3NzuQayb7BB+dlH9kQaRgWi5bBKZgzdNkUxdz7wPlTXsiRGEbpCfGKzK0qOz5azbX80JUunfkTq0XAio5abk1BT5g0Z8o+adIPzs3N8VYmyx5wsBOiJOvZypWUU0NXeI/CpH/mb3JitSRPrDkcoeQ6Mmej+e3MiYHLuOgJklmkzoPUW0E8s6WZ6SxkuJ2paTE05ro2b5fJiHdtakD7GodqKIH0mdHsTC52PpF6jZSLS74wvhtZz1vayBtm9A1hJUiW9vmkUq+0I8HM5xV+Onw8IUkiDKSira6m1WwyLul/vPV1ny9EfwVAMDgHwTUw3CdA2GVf5L8CkHpjq+B2u8VLfwYOk7LlKQ0DtHA6gRQaW8fPDX31H9XaPbywB8j8AAAAAElFTkSuQmCC';
}

export async function downloadResourcePack(mapPath: string, ref?: Ref) {
  const { resourcePack } = storeToRefs(useSourcesStore());
  const { minecraftDir } = storeToRefs(useInstallerStore());

  const rpName = `Drehmal Resource Pack v${resourcePack.value.version}.zip`;
  const filePath = path.join(minecraftDir.value, 'resourcepacks', rpName);

  fs.copyFileSync(path.join(mapPath, 'resources.zip'), filePath);
  log.info(`Copied resource pack to ${filePath}`);

  const optionsFilePath = path.join(minecraftDir.value, 'options.txt');
  const data = fs.readFileSync(optionsFilePath).toString().split('\n');
  const resourceOptIndex = data.findIndex(
    (item: string[]) => item.indexOf('resourcePacks:') !== -1
  );
  data[
    resourceOptIndex
  ] = `resourcePacks:["vanilla","Fabric Mods","file/${rpName}"]`;

  fs.writeFileSync(optionsFilePath, data.join('\n'), 'utf-8');
  log.info('Updated Resource Pack order');
}
