import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSourcesStore = defineStore('sources', () => {
  const map = ref({
    version: '2.2.0',
    versionName: 'Drehmal 2.2 Apotheosis Beta 1.3.0',
    compressedSizeInBytes: 4291563668,
    uncompressedSizeInBytes: 6349809322,
    hash: 'cf442078a485831e9fc19cb7212dff949e4fd027285ff1a62599eb841a6aa1d9',
    shards: [
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_24a975cc26554a10a6e7e35b4ba80879.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_bb088fbb93a245a7b898e3c285d42840.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_4b7ad8ee43bf4380bccb160bb25ea49a.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_2499405e78014c34bd9bc00d6b9495b5.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_92eea6b559884d69bc211826c3ceab94.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_047ea6ff78c342309d243ba29328a1e4.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_7ddf43c67e34415aafad6a5c779dfe1d.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_a772537ac7fc4d3292882cb54fbfbc6e.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_5d383eb1296b452cb9bf0646e431efa2.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_a86b347db8e34938ac7414127959e16c.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_5a49a8cea54a4871838902ed894cb24f.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_eb79b09faf4e43f9932d69fc3310638c.zip',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_65051262b5134519b9778a467e2fda57.zip',
    ],
  });

  const resourcePack = ref({
    version: '1.3.0',
    source:
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_bd3d3973f1cb45b3becd31f14f01c30c.zip',
  });

  const launcher = ref({
    fabric: {
      name: 'fabric',
      version: '0.11.2',
      source:
        'https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.11.2/fabric-installer-0.11.2.jar',
      minecraftVersion: '1.17.1',
    },
    // using https://www.drehmal.net/2-2-mod-list
    modList: [
      {
        name: 'Animatica',
        url: 'https://modrinth.com/mod/animatica',
        source:
          'https://cdn.modrinth.com/data/PRN43VSY/versions/0.4%2B1.17/animatica-0.4%2B1.17.jar',
        mc_version: '1.17.1',
        mod_version: '0.4',
      },
      {
        name: 'CIT Resewn',
        url: 'https://modrinth.com/mod/cit-resewn',
        source:
          'https://cdn.modrinth.com/data/otVJckYQ/versions/0.9.1%2B1.17.1/CITResewn-0.9.1%2B1.17.1.jar',
        mc_version: '1.17.1',
        mod_version: '0.9.1',
      },
      {
        name: 'Cull Leaves',
        url: 'https://modrinth.com/mod/cull-leaves',
        source:
          'https://cdn.modrinth.com/data/GNxdLCoP/versions/2.3.2/cullleaves-2.3.2.jar',
        mc_version: '1.17.1',
        mod_version: '2.3.2',
      },
      {
        name: 'Dynamic FPS',
        url: 'https://modrinth.com/mod/dynamic-fps',
        source:
          'https://cdn.modrinth.com/data/LQ3K71Q1/versions/v2.0.6/dynamic-fps-2.0.6.jar',
        mc_version: '1.17.1',
        mod_version: '2.0.6',
      },
      {
        name: 'Entity Culling',
        url: 'https://modrinth.com/mod/entity-culling',
        source:
          'https://cdn.modrinth.com/data/NNAgCjsB/versions/1.5.0-fabric-1.17/entityculling-fabric-mc1.17.1-1.5.0.jar',
        mc_version: '1.17.1',
        mod_version: '1.5.0',
      },
      {
        name: 'Fabric API',
        url: 'https://modrinth.com/mod/fabric-api',
        source:
          'https://cdn.modrinth.com/data/P7dR8mSH/versions/0.46.1%2B1.17/fabric-api-0.46.1%2B1.17.jar',
        mc_version: '1.17.1',
        mod_version: '0.46.1',
      },
      {
        name: 'FabricSkyboxes',
        url: 'https://modrinth.com/mod/fabricskyboxes',
        source:
          'https://cdn.modrinth.com/data/YBz7DOs8/versions/sP82Z0Yi/fabricskyboxes-0.7.2%2Bmc1.17.1.jar',
        mc_version: '1.17.1',
        mod_version: '0.7.2',
      },
      {
        name: 'Indium',
        url: 'https://modrinth.com/mod/indium',
        source:
          'https://cdn.modrinth.com/data/Orvt0mRa/versions/1.0.1%2Bmc1.17.1/indium-1.0.1%2Bmc1.17.1.jar',
        mc_version: '1.17.1',
        mod_version: '1.0.1',
      },
      {
        name: 'Iris Shaders',
        url: 'https://modrinth.com/mod/iris',
        source:
          'https://cdn.modrinth.com/data/YL57xq9U/versions/pkGrlTNQ/iris-mc1.17.1-1.2.7.jar',
        mc_version: '1.17.1',
        mod_version: '1.2.7',
      },
      {
        name: 'LambDynamicLights',
        url: 'https://modrinth.com/mod/lambdynamiclights',
        source:
          'https://cdn.modrinth.com/data/yBW8D80W/versions/2.1.0%2B1.17/lambdynamiclights-2.1.0%2B1.17.jar',
        mc_version: '1.17.1',
        mod_version: 'LambDynamicLights 2.1.0 (1.17-1.18)',
      },
      {
        name: 'Lazy DFU',
        url: 'https://modrinth.com/mod/lazydfu',
        source:
          'https://cdn.modrinth.com/data/hvFnDODi/versions/0.1.2/lazydfu-0.1.2.jar',
        mc_version: '1.17.1',
        mod_version: '0.1.2',
      },
      {
        name: 'Lithium',
        url: 'https://modrinth.com/mod/lithium',
        source:
          'https://cdn.modrinth.com/data/gvQqBUqZ/versions/mc1.17.1-0.7.5/lithium-fabric-mc1.17.1-0.7.5.jar',
        mc_version: '1.17.1',
        mod_version: '0.7.5',
      },
      {
        name: 'Starlight',
        url: 'https://modrinth.com/mod/starlight',
        source:
          'https://cdn.modrinth.com/data/H8CaAYZC/versions/Starlight%201.0.0%201.17.x/starlight-1.0.0%2Bfabric.73f6d37.jar',
        mc_version: '1.17.1',
        mod_version: '1.0.0',
      },
      {
        name: 'Sodium',
        url: 'https://modrinth.com/mod/sodium',
        source:
          'https://cdn.modrinth.com/data/AANobbMI/versions/mc1.17.1-0.3.4/sodium-fabric-mc1.17.1-0.3.4%2Bbuild.13.jar',
        mc_version: '1.17.1',
        mod_version: '0.3.4',
      },
      {
        name: 'Sodium Extra',
        url: 'https://modrinth.com/mod/sodium-extra',
        source:
          'https://cdn.modrinth.com/data/PtjYWJkn/versions/1OzghAbl/sodium-extra-0.4.18%2Bmc1.17.1-build.97.jar',
        mc_version: '1.17.1',
        mod_version: '0.4.18',
      },
      {
        name: "Reese's Sodium Options",
        url: 'https://modrinth.com/mod/reeses-sodium-options',
        source:
          'https://cdn.modrinth.com/data/Bh37bMuy/versions/r2sBtu0R/reeses_sodium_options-1.5.0%2Bmc1.17.1-build.69.jar',
        mc_version: '1.17.1',
        mod_version: '1.5.0',
      },
      {
        name: 'WI Zoom',
        url: 'https://modrinth.com/mod/wi-zoom',
        source:
          'https://cdn.modrinth.com/data/o7DitHWP/versions/OYzl0qI6/WI-Zoom-1.3-MC1.17.1.jar',
        mc_version: '1.17.1',
        mod_version: '1.3',
      },
      {
        name: 'Entity Texture Features',
        url: 'https://modrinth.com/mod/entitytexturefeatures',
        source:
          'https://cdn.modrinth.com/data/BVzZfTc1/versions/a4YzsmzU/entity_texture_features_fabric_1.17.1-4.3.1.jar',
        mc_version: '1.17.1',
        mod_version: '4.3.1',
      },
      {
        name: 'CEM',
        url: 'https://github.com/YoungSoulluoS/cem_Fork',
        source:
          'https://github.com/YoungSoulluoS/cem_Fork/releases/download/Soul_Fork_10_1.19.4/cem-0.7.1_S8_1.17.jar',
        mc_version: '1.17.1',
        mod_version: '0.7.1',
      },
    ],

    launcher_icon:
      'data:image/png;base64,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',
  });

  const shaders = ref({
    name: 'Sildurs Enhanced Default',
    version: '1.16',
    source:
      'https://mediafilez.forgecdn.net/files/4688/998/Sildur%27s%20Enhanced%20Default%20v1.16%20Fancy.zip',
  });

  const server = ref({
    // per https://minecraft.wiki/w/Java_Edition_1.17.1
    source:
      'https://piston-data.mojang.com/v1/objects/a16d67e5807f57fc4e550299cf20226194497dc2/server.jar',
    version: '1.17.1',
    properties: [
      'enable-command-block=true',
      'view-distance=16',
      'spawn-protection=0',
    ],
  });

  return {
    map,
    resourcePack,
    launcher,
    shaders,
    server,
  };
});
