import { defineStore } from 'pinia';
import { ref } from 'vue';
const path = require('path');
const os = require('os');
// export const usePathStore = defineStore('path', () => {
//   const count = ref(0);
//   const name = ref('Jimmy');
//   const doubleCount = computed(() => count.value * 2);
//   function increment() {
//     count.value++;
//   }
//   return { count, name, doubleCount, increment };
// });

// https://pinia.vuejs.org/core-concepts/#Setup-Stores
// In Setup Stores:
// ref()s become state properties
// computed()s become getters
// function()s become actions

export const useSourcesStore = defineStore('sources', () => {
  const map = ref({
    // version: '2.2.0',
    // versionName: 'Drehmal 2.2 Apotheosis Beta 1.0.1',
    // shards: [
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_8e925ea6299e47418cdaa66028baedd5.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_e5a2493e8de946499cd71da713dfb19a.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_c1eeae44689847579b8b9efa810dd0ae.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_57ea04020fe24d198768333dffeef9bb.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_3c187c3db300467eab209935ca0e2a3b.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_d45d6dce2cab4242ac754b4b24f8b062.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_d841d94fd8334f58b63ab8aa83ab5662.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_716e90b4fa9d4d70b61e457a5ddbce06.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_8934d61b88594e7ebcd8e157d9e5dcef.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_8674399f1aaf4bdc90c10db48f5b29eb.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_2e05191da7f84d4a829c0a887a216d2f.gz',
    //   'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_e10c25be92704b45bf34c49cf6f2685e.gz',
    // ],
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
    version: '0.0',
    source:
      'https://www.drehmal.net/_files/archives/a539b0_813ec06a45c34d31a634264df7f58649.zip?dn',
  });

  const mods = ref({
    fabric: {
      version: '0.11.2',
      source:
        'https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.11.2/fabric-installer-0.11.2.jar',
      minecraftVersion: '1.17.1',
    },
    modLists: {
      all: [
        'https://cdn.modrinth.com/data/otVJckYQ/versions/0.9.1%2B1.17.1/CITResewn-0.9.1%2B1.17.1.jar',
        'https://cdn.modrinth.com/data/BVzZfTc1/versions/a4YzsmzU/entity_texture_features_fabric_1.17.1-4.3.1.jar',
        'https://cdn.modrinth.com/data/YBz7DOs8/versions/sP82Z0Yi/fabricskyboxes-0.7.2%2Bmc1.17.1.jar',
        'https://cdn.modrinth.com/data/Orvt0mRa/versions/1.0.1%2Bmc1.17.1/indium-1.0.1%2Bmc1.17.1.jar',
        'https://cdn.modrinth.com/data/yBW8D80W/versions/2.1.0%2B1.17/lambdynamiclights-2.1.0%2B1.17.jar',
        'https://cdn.modrinth.com/data/P7dR8mSH/versions/0.46.1%2B1.17/fabric-api-0.46.1%2B1.17.jar',
        'https://cdn.modrinth.com/data/PRN43VSY/versions/0.4%2B1.17/animatica-0.4%2B1.17.jar',
        'https://cdn.modrinth.com/data/PtjYWJkn/versions/1OzghAbl/sodium-extra-0.4.18%2Bmc1.17.1-build.97.jar',
        'https://cdn.modrinth.com/data/Bh37bMuy/versions/r2sBtu0R/reeses_sodium_options-1.5.0%2Bmc1.17.1-build.69.jar',
        'https://cdn.modrinth.com/data/LQ3K71Q1/versions/v2.0.6/dynamic-fps-2.0.6.jar',
        'https://cdn.modrinth.com/data/AANobbMI/versions/mc1.17.1-0.3.4/sodium-fabric-mc1.17.1-0.3.4%2Bbuild.13.jar',
      ],
    },
  });

  return {
    map,
    resourcePack,
    mods,
  };
});
