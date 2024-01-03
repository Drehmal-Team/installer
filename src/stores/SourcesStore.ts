import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSourcesStore = defineStore('sources', () => {
  const map = ref({
    version: '2.2.0',
    versionName: 'Drehmal 2.2 Apotheosis Beta 1.1.0',
    shards: [
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_52c1521efff2443d800109cd1b92c7e4.gz',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_2a1565e7be5e42cda13474b9fafc35c2.gz',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_76c1f8bb24c34f7787a4aba1e0049cb9.gz',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_60de849f6e2e4910befac741a80d9a8a.gz',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_a564fd72ed2149029dc00760b110af68.gz',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_b61c00c8b19543b0897f8ce98f932b7c.gz',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_c315430f541a4ffcbca4e1e53f3ee0d3.gz',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_f4e7484f3c1d4013b981dc607c090dda.gz',
      'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_af89d05099bf4899a2771fd6460985a2.gz',
    ],
  });

  const resourcePack = ref({
    version: '1.1.0',
    source:
      'https://www.drehmal.net/_files/archives/a539b0_9a3145ee71fb4e3d81fe35b12dca08e0.zip?dn=Primordial%20Pack%20BETA%201.1.0.zip',
  });

  const launcher = ref({
    fabric: {
      name: 'fabric',
      version: '0.11.2',
      source:
        'https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.11.2/fabric-installer-0.11.2.jar',
      minecraftVersion: '1.17.1',
    },
    modList: [
      {
        name: 'CIT Resewn',
        url: 'https://modrinth.com/mod/cit-resewn',
        source:
          'https://cdn.modrinth.com/data/otVJckYQ/versions/0.9.1%2B1.17.1/CITResewn-0.9.1%2B1.17.1.jar',
        mc_version: '1.17.1',
        mod_version: '0.9.1',
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
        name: 'LambDynamicLights',
        url: 'https://modrinth.com/mod/lambdynamiclights',
        source:
          'https://cdn.modrinth.com/data/yBW8D80W/versions/2.1.0%2B1.17/lambdynamiclights-2.1.0%2B1.17.jar',
        mc_version: '1.17.1',
        mod_version: 'LambDynamicLights 2.1.0 (1.17-1.18)',
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
        name: 'Animatica',
        url: 'https://modrinth.com/mod/animatica',
        source:
          'https://cdn.modrinth.com/data/PRN43VSY/versions/0.4%2B1.17/animatica-0.4%2B1.17.jar',
        mc_version: '1.17.1',
        mod_version: '0.4',
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
        name: 'Dynamic FPS',
        url: 'https://modrinth.com/mod/dynamic-fps',
        source:
          'https://cdn.modrinth.com/data/LQ3K71Q1/versions/v2.0.6/dynamic-fps-2.0.6.jar',
        mc_version: '1.17.1',
        mod_version: '2.0.6',
      },
    ],
    launcher_icon:
      'data:image/png;base64,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',
  });

  return {
    map,
    resourcePack,
    launcher,
  };
});
