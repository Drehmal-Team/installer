import { storeToRefs } from 'pinia';
import { useSourcesStore } from 'src/stores/SourcesStore';

const fs = require('fs');

export function updateMinecraftOpts(filename: string) {
  // Parse options file into an array of strings for each line
  const lines: string[] = fs.readFileSync(filename, 'utf-8').split('\n');
  // Create object to store the options as a json object for easy access
  const options: Record<string, string> = {};
  // add each option to the created object
  lines.forEach((line) => {
    const [key, value] = line.split(':');
    if (key && value) {
      options[key.trim()] = value.trim();
    }
  });

  const { resourcePack } = storeToRefs(useSourcesStore());
  const rpName = `Drehmal Resource Pack v${resourcePack.value.version}.zip`;

  // modify options here
  // update resource pack order to include Drehmal's pack at the top
  options['resourcePacks'] = `["vanilla","Fabric Mods","file/${rpName}"]`;
  // disable clouds, gets in the way of towers/structures
  options['renderClouds'] = 'false';
  // increase render distance to required minimum (consider scale based on memory allocation)
  if (parseInt(options['renderDistance']) < 8) options['renderDistance'] = '8';
  // maximise unfocused chat size so players can properly use menus
  options['chatHeightUnfocused'] = '1.0';
  // ensure custom music is enabled
  options['soundCategory_music'] = '1.0';
  options['soundCategory_record'] = '1.0';

  let newOptions = '';
  Object.keys(options).forEach(
    (key) => (newOptions += `${key}:${options[key]}\n`)
  );

  fs.writeFileSync(filename, newOptions);
}
