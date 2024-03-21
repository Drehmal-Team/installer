import { storeToRefs } from 'pinia';
import { useSourcesStore } from 'src/stores/SourcesStore';

const fs = require('fs');

export function updateMinecraftOpts(drehmalOpts: string, oldOpts: string) {
  // Create object to store the options as a json object for easy access
  const options: Record<string, string> = {};

  if (fs.existsSync(drehmalOpts)) {
    console.log(`Drehmal options file found at "${drehmalOpts}"!`);
    // Parse options file into an array of strings for each line
    const lines: string[] = fs.readFileSync(drehmalOpts, 'utf-8').split('\n');
    // add each option to the created object
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        options[key.trim()] = value.trim();
      }
    });
  } else if (fs.existsSync(oldOpts)) {
    // TODO: repeat above check for original .minecraft dir, otherwise create a new options file
    console.log(
      `Drehmal options not found - falling back to MC options "${oldOpts}"...`
    );
    console.log(`Minecraft options file found at "${oldOpts}"!`);
    // Parse options file into an array of strings for each line
    const lines: string[] = fs.readFileSync(oldOpts, 'utf-8').split('\n');
    // add each option to the created object
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        options[key.trim()] = value.trim();
      }
    });
  } else {
    console.log(
      `Options file not found at "${oldOpts}" - creating new with defaults...`
    );
    // Ensure render distance is set to minimum if the file doesn't exist
    options['renderDistance'] = '16';
  }

  const { resourcePack } = storeToRefs(useSourcesStore());
  const rpName = `Drehmal Resource Pack v${resourcePack.value.version}.zip`;

  // modify options here
  // update resource pack order to include Drehmal's pack at the top
  options['resourcePacks'] = `["vanilla","Fabric Mods","file/${rpName}"]`;
  // disable clouds, gets in the way of towers/structures
  options['renderClouds'] = 'false';
  // increase render distance to required minimum (consider scale based on memory allocation)
  if (parseInt(options['renderDistance']) < 16)
    options['renderDistance'] = '16';
  // if master volume is too low, set it to 50% (MC defaults this to 100% on first run if missing)
  if (
    options['soundCategory_master'] !== undefined &&
    parseInt(options['soundCategory_master']) < 0.5
  )
    options['soundCategory_master'] = '0.5';
  // maximise unfocused chat size so players can properly use menus
  options['chatHeightUnfocused'] = '1.0';
  // ensure custom music is enabled
  options['soundCategory_music'] = '1.0';
  options['soundCategory_record'] = '1.0';
  // set gui scale to 3 for readability of items with lore (eg. legendaries/mythicals)
  options['guiScale'] = '3';
  // brightness to 50%, rather than the default of 0
  options['gamma'] = '0.5';

  let newOptions = '';
  Object.keys(options).forEach(
    (key) => (newOptions += `${key}:${options[key]}\n`)
  );

  fs.writeFileSync(drehmalOpts, newOptions);
}
