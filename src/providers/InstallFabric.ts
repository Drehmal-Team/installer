/* eslint-disable @typescript-eslint/no-explicit-any */
import { storeToRefs } from 'pinia';
import { useInstallerStore } from 'src/stores/InstallerStore';
import { useSourcesStore } from 'src/stores/SourcesStore';
import { useStateStore } from 'src/stores/StateStore';
import { Ref } from 'vue';
import { downloadFile } from './DownloadFile';
import { getJre } from './JavaDownload';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

export async function installFabric(ref: Ref) {
  const startTime = Date.now();

  const { launcher, map } = storeToRefs(useSourcesStore());
  const { minecraftDir, drehmalDir, memory, javaExePath } = storeToRefs(
    useInstallerStore()
  );
  const { processingFabric } = storeToRefs(useStateStore());

  const fabricFolder = path.join(drehmalDir.value, 'installer', 'fabric');
  if (!fs.existsSync(fabricFolder))
    fs.mkdirSync(fabricFolder, { recursive: true });
  const fabricPath = path.join(
    fabricFolder,
    'fabric-installer-' + launcher.value.fabric.version + '.jar'
  );

  ref.value.label = 'Downloading Java runtime';
  await getJre(ref);
  ref.value.progress = 0.25;
  ref.value.percent = 25;

  console.log(`Downloading Fabric installer to "${fabricPath}"`);
  ref.value.label = 'Downloading Fabric installer';
  downloadFile(launcher.value.fabric.source, fabricPath).then(() => {
    ref.value.label = 'Installing Fabric';
    ref.value.progress = 0.5;
    ref.value.percent = 50;
    console.log('Calling Fabric installer');
    const fabricProc = spawn(javaExePath.value, [
      '-jar',
      fabricPath,
      'client',
      '-dir',
      minecraftDir.value,
      '-mcversion',
      launcher.value.fabric.minecraftVersion,
    ]);
    fabricProc.stdout.on('data', (data: any) => {
      console.log(`Fabric: ${data}`);
    });
    fabricProc.stderr.on('data', (data: any) => {
      console.error(`Fabric: ${data}`);
    });

    fabricProc.on('close', async (code: any) => {
      const taken = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log(`Fabric process exited with code ${code} (${taken}s total)`);

      ref.value.label = 'Fabric successfully installed!';
      ref.value.progress = 0.67;
      ref.value.percent = 67;

      const profileFilePath = path.join(
        minecraftDir.value,
        'launcher_profiles.json'
      );

      console.log(`Updating installer profiles file at: ${profileFilePath}`);
      const data = JSON.parse(
        fs.readFileSync(profileFilePath, 'utf-8') as string
      );

      data['profiles'][map.value.versionName] = JSON.parse(
        JSON.stringify(
          data['profiles'][
            `fabric-loader-${launcher.value.fabric.minecraftVersion}`
          ]
        )
      );

      data['profiles'][map.value.versionName]['name'] = map.value.versionName;
      data['profiles'][map.value.versionName]['icon'] =
        launcher.value.launcher_icon; // in base64
      // convert to MB to handle fractional values (eg. 10.5GB)
      const memoryInMb = Math.round(memory.value * 1024);
      data['profiles'][map.value.versionName][
        'javaArgs'
      ] = `-Xmx${memoryInMb}M`;
      // ['javaArgs'] = `-Xmx${memoryInMb}M -Xms${memoryInMb}M  -XX:+UnlockExperimentalVMOptions -XX:+UnlockDiagnosticVMOptions -XX:+AlwaysActAsServerClassMachine -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+UseNUMA -XX:NmethodSweepActivity=1 -XX:ReservedCodeCacheSize=400M -XX:NonNMethodCodeHeapSize=12M -XX:ProfiledCodeHeapSize=194M -XX:NonProfiledCodeHeapSize=194M -XX:-DontCompileHugeMethods -XX:MaxNodeLimit=240000 -XX:NodeLimitFudgeFactor=8000 -XX:+UseVectorCmov -XX:+PerfDisableSharedMem -XX:+UseFastUnorderedTimeStamps -XX:+UseCriticalJavaThreadPriority -XX:ThreadPriorityPolicy=1 -XX:AllocatePrefetchStyle=3 -XX:+UseG1GC -XX:MaxGCPauseMillis=130 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=28 -XX:G1HeapRegionSize=16M -XX:G1ReservePercent=20 -XX:G1MixedGCCountTarget=3 -XX:InitiatingHeapOccupancyPercent=10 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:SurvivorRatio=32 -XX:MaxTenuringThreshold=1 -XX:G1SATBBufferEnqueueingThresholdPercent=30 -XX:G1ConcMarkStepDurationMillis=5 -XX:G1ConcRSHotCardLimit=16 -XX:G1ConcRefinementServiceIntervalMillis=150`;
      const currDateISO = dayjs.utc().toISOString();
      data['profiles'][map.value.versionName]['lastUsed'] = currDateISO;
      data['profiles'][map.value.versionName]['created'] = currDateISO;

      data['profiles'][map.value.versionName]['gameDir'] = drehmalDir.value;

      if (javaExePath.value)
        data['profiles'][map.value.versionName]['javaDir'] = javaExePath.value;

      fs.writeFileSync(profileFilePath, JSON.stringify(data), 'utf-8');

      ref.value.label = 'Minecraft profile created!';
      ref.value.progress = 1;
      ref.value.percent = 100;
      ref.value.img =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAACXBIWXMAAAsTAAALEwEAmpwYAAACqElEQVRYhdVYzY7SUBT+Tu1CTWRaG4UncKMOxOWMhhg37khYwBgT43P4ADyIiSawMLBzA0LUWRLGv4VPwMwECjVhiJYeF6W1pTBD7+2Mw7e67b0993733HvOd0r1ahuFUh6NWoexgSiU8tSodUDMjEatw0QETb/2v9cVCyPzBMyMQilPVK+2GQAUhbClbRaR8egEjuMeJBUA9JvX/U7DSElP8OJp59T+1+/z0nMMBpa/8eZw4hLx4JG4mlKjX8ZALqOv7Ov1TWn7U8uGYaQwGFj+u4hFkUnKO02/zQBq+09OHb+324LDDFpz/LI1Ti079E4FxbKxFPfSGq6Qa+jn8NeZ47fTmt/u9U35BRCgkgST8m4TzPF39NW7B6HnZw9bmDkc244HAqC4zhVDNq1DIXmX3r+tQVXk7Ciyi0jgZCYCKSIOMxTJnfRAkp4VioOVYhffjsZ4++mx0KSlQJQjANX53agUu+j1TaG7IhzQbccR/TSUZw4OE4haIHEiIijvtsDMyGV0KY9GwRdLJBvIHw4nK7YTIbI332lvaYtnPOiJ78djvPmYlCf+IREiwUz95XAU6c+mNZ/kzDmfsicRIl6mrhS72E5roagEuES/Ho1Q/SyWudeBMBFVWZ2CglGJ4YZYGSm0DqhebbNXjxhGKpb6fZnvYPLHjtyJSrHrtw/6pp8nVqG00wQRYnlsatm+jDeHE7nMfse4kYjWymV0Xz2L4lzC76K6vQjIi8ZLohqlPOLtvFeXeDhLKy1GNdE6JIhEjlY2HdBOa1R8yWutJUSmlh27bl+8E88ffcDM4YgMUYjgsHglGFzjIkIrHgwsGEZq6cA4uHtra+n737MZfhxb0vYBhP6gAPM84j0E/29tAszhxG8ruDzVqgzIO1oEgIMMNwgEAH8Bhif2yStQayoAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==';
      processingFabric.value = false;
    });
  });
}
