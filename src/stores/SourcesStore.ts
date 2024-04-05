import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSourcesStore = defineStore('sources', () => {
  const map = ref({
    version: '2.2.0',
    versionName: 'Drehmal: APOTHEOSIS',
    compressedSizeInBytes: 4294261140,
    uncompressedSizeInBytes: 6358455781,
    hash: '73d5d8a88611deb342f2a13881b824df1dd48f1d1d904591c641fc236d3172a7',
    shards: [
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_1925ee30e7144dd4ba217b8ae3bea923.zip', // 1
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_189f047ba71a4e698b3c207fa4b730b2.zip', // 2
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_2cc4911c6280435382e391474b862ea3.zip', // 3
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_957adc1e81384831996eb119710b7cd5.zip', // 4
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_dfde9ffd8a6b4d759a95a5ad8091a7e9.zip', // 5
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_2595f63014994e4d813eefd063ed19f3.zip', // 6
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_bdd7e62c857b48e2bc144242d2f862c2.zip', // 7
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_8de5237a390647cab15d7981fb76c49f.zip', // 8
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_f803fec50ac74fa695db63b9731cb59c.zip', // 9
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_4e16e84671844449b94519d4f95eba2b.zip', // 10
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_c50993f7e7d34bce93b83f13fe3140f8.zip', // 11
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_4ac90df5b7ed4250b7be57f0c39550d1.zip', // 12
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_40bba80fd5c7408c9bc9a93ab8288149.zip', // 13
    ],
  });

  const resourcePack = ref({
    version: '2.2.0',
    source:
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_e108b896cb2148eb986135f35dff5115.zip',
  });

  const partner = ref({
    name: 'Apex Hosting',
    affilLink: 'https://billing.apexminecrafthosting.com/aff.php?aff=6377',
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
    partner,
    launcher,
    shaders,
    server,
  };
});
