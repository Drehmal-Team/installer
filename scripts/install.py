import os
import platform
import shutil
import requests
import subprocess
from os import path
import json
from time import sleep

from split import extract_split

PLATFORM = platform.system()

DREHMAL_VERSION_NAME = 'Drehmal 2.2 Apotheosis Beta - 1.0.1'
DREHMAL_VERSION_FILENAME = 'drehmal-2.2-apotheosis-beta-1.0.1'
DREHMAL_ICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHoklEQVR4Xr2by24dRRCG52RhoySABSGwQUiAiLxAQmzZsGOBeAJehEfIi+QRsuEhQGITISE2LBA3yUCIYi98UI2n2n//U7ee4+Ss7HN6uru+rkt3dc3uqwdf7Kfg8+/zp6tfz87/MZ94dvEs6qr9dnb+d6mdNjo5ft1sf/votvn9yfFrq+9ffeWu2XYXAagI//2vP0wP3vwwFGhUYKszD4K0PQTECoAltAxirboIrx+BkAn6+39/Dq38/Tv3wvYWFA+GdISaoRrRAIwILp2puv/410/T23ffahMdFbJKpApD5sMayVAQxO7z9z4zfYBn5yo8r/YWwc8fTdN0eoXg6P1bjcXu5DLkksG4Wu2137BAdAAyoXFWCiAS/Py75Ykn03T8tS3TDEE+pz0EbG0BqUCogNh98s7HbhSwvDquvCd8ExyleDJN0y/TdPzNGsT5w2ma3o0hyFOZZnDPCIk1QrVhBcALZVWVR7VeiRpBcMzB0psREB6EDkAWvyurrhMNAUgjgTCtTYKfQ5/wIiHsPnrjg84EolDmqvzDa9VOAbwkCPuzW53JqCagKYgWNABbYvhs68uKtlVavHoa3iLHqM6TooPXp2USAgD9hmUKDUDFo/PgpqNLpV7U/9O8IfafmUPFQboA7t+5N5vAaBx3AaBGkDYcFwRvvoRCqK7oiBZgW88Z7ioA9vv9tNvtWn9umAPnxr5gRPgOAplKBCKKDrxvUF+wAsDOg4nrBC5+pt0aTRQBVIRXf4IbpuZjYP9wiCZYWjADQPXnAZAq/9ZBAACjwgtkb9fIYKTvoy+vt82jIZKjgWkCh0CQ3Z7u6uZ479i9CMa/KQT8nrVA4UaOsWIKKxNgR+hBsFSwacKiBTrJiurn8WDRDnWu4FgtCCy8Fw4bANkISRj87ekfnaOTifHD+B1PfIZAZsAHIFW/G4s4xj7BM1n9fmUCAkDO0Pphby+UIz+AIC4eX7qnvurpTftjSNG+QzWhuvoyhqkBktiorM5oKPJCEMKzdqI4l2zjVcknmFFATQAns6K/eF4lPBqKrH24Z/veqTMDIP1lEFwA8nB04lNPnIWfZkYnl3NYUyfoHUQYAp5Kre35IRDcjZCeBj0APOiWfXkVgABRCFsBoCagT3DPApIRGh00g8DOKAKgCUpNx7EWjPiBplHGSfNGAbC9sSp7AND7akYGM7QCYXQxurF1r2Ck3hCAhHzJHM/H4S0aoIN6mhAlMTkhMQKg2zIz9SDdJk0VgAivH4FgAsBdYeZ4KrsxnABrgWUCWQpuNOmqAiMEvTvoAGA0UNvLAFjmkKWxVQtEBRFAZP+44BkAzTJbqfjVTlDT4p7tVQBYMdjLyUUakAEIkzBg99Fp9IUB4PBjnSN48FENiAB0eQRIsVsHMpyHmxUeMYEo/KDq4sAcBbIIkDnADgBctMhzDGEMAFxdedvX+fsgy4tO0LL/K98Th8AMwJyHEGGXmye8bWIIHQDNCerEzB0YqJQJIckD8CbEWn3pN9oDhACWBVhBgMVDLZD5mAkRFK7bgZFKocp3QCBZwQOy87v6/6qSg3eBsggjx2FrPmoSnJxxU2K8sqsJeBAcu6gAwEfT1a+aImiDdRGLqy9NVzlBVFcXgjyZ3ADdFABMirJdj/okKwqtssLosKw02WyLmU9YZuYdh7lQIT0GP7q+TB0dWyFZwjcNsLJAUf6urUSiCRUtsISXbt2L2EH4KQDJfWqj7FKEVQ6rOzx1jCDgM9X6g4oGenFfT4HSR6sPYACzWjg1OubtTeIcrclwtUZF+AZ70P+gSVuRSC78Og2IAMz05dLy277UJXNOkRaUhIfr8tDxBRcxbkIEr8Yw2RndrsyrQUmHzDlZEFAYtvnwGq4Qeq0mVmaqiwJVAGqH0f67mwAlKzhBmQmvfa0uZGGQyi2UmRXeogEWgPk79Qdsp3RO8PYaWbpduvUgWADw9OiF5M0agCssguOuqzMHJ1VlhdkKAAtCdAGr82QA6hDN63G+CsvK0uaVXz4CwgIgP1tbUwRZBaAQMrW3NACjgkQjcyfIk8oANPWXP5aCx5UPkC+cQkltKxPOUu7atjQniB5eJAoBjDhF9QvzBL1zglMjiADk72qitYNM/3D2KAQgz0bX40PUC1tVnQwXRGwtnmYQVuosBIC5cr0er9ojl8mEGqB+YqkaMStCBkpmUfAoRM7+BypVzIwQa0AVgOWVI9XkyZilMlshPIbCraBEzwQgE4uKpTKhshXA5zPv3fyJ8S5BNg9xjtauNNWAQwGUNEGc4GlQOBWc+yvRQSPDEAAskOCb2MqgvCKuJkAFqfvyhNYeU6WZjlGpDPPqGF0NiAB4ISlTQ9MxGiXyrvc2KsIiCF5tEM5jM4CDICRxvxK+LNheURS2ZU1wt8KeBmSrfOjvXH98SH/WNZzX3yot/rIB8FGYne8oiNHd6iotzlVilTK50UlaQnMfW8c9ZPVlDvPlaFajNyqwtq8IfigIayPlzVfMDl+qHHplBjv1VqsicJYQzWBv1pT99atRWh80awDWCOng2ftD2SSt37k2SNp4dwKj/SuUbAGwOErHaO8NZq/OyQMjYEZeea++qzgKhtvj1bz+9j/yiDyyPT87LgAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC'
RESOURCE_PACK_URL = 'https://www.drehmal.net/_files/archives/a539b0_813ec06a45c34d31a634264df7f58649.zip?dn'
DREHMAL_DOWNLOAD_SOURCES = {
    'gdrive': [
        # Hosted by Rift
        'https://drive.google.com/u/0/uc?id=1yC9OyLTg7apIPJ5K5DZrLtnZHpROi2IG',
        # Hosted by Major
        'https://drive.google.com/u/0/uc?id=1K-Rfx7DuRt894n9t9xoixw0jbZZBQMfg',
        # Hosted by Keeko
        'https://drive.google.com/u/0/uc?id=1wgDS2SexMTfKMDpJIQlGJA3aTt5bMl2V'
    ],
    'drehmal.net': [
        # 'https://www.drehmal.net/_files/archives/a539b0_813ec06a45c34d31a634264df7f58649.zip?dn'
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_8e925ea6299e47418cdaa66028baedd5.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_e5a2493e8de946499cd71da713dfb19a.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_c1eeae44689847579b8b9efa810dd0ae.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_57ea04020fe24d198768333dffeef9bb.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_3c187c3db300467eab209935ca0e2a3b.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_d45d6dce2cab4242ac754b4b24f8b062.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_d841d94fd8334f58b63ab8aa83ab5662.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_716e90b4fa9d4d70b61e457a5ddbce06.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_8934d61b88594e7ebcd8e157d9e5dcef.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_8674399f1aaf4bdc90c10db48f5b29eb.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_2e05191da7f84d4a829c0a887a216d2f.gz',
        'https://5b92a8a6-6d33-4119-8522-53f0f5e49ea3.usrfiles.com/archives/5b92a8_e10c25be92704b45bf34c49cf6f2685e.gz',
    ]
}

# Fabric CLI information: https://fabricmc.net/wiki/install
FABRIC_INSTALLER_URL = 'https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.11.2/fabric-installer-0.11.2.jar'
MODS_LIST = [
    "https://cdn.modrinth.com/data/otVJckYQ/versions/0.9.1%2B1.17.1/CITResewn-0.9.1%2B1.17.1.jar",
    "https://cdn.modrinth.com/data/BVzZfTc1/versions/a4YzsmzU/entity_texture_features_fabric_1.17.1-4.3.1.jar",
    "https://cdn.modrinth.com/data/YBz7DOs8/versions/sP82Z0Yi/fabricskyboxes-0.7.2%2Bmc1.17.1.jar",
    "https://cdn.modrinth.com/data/Orvt0mRa/versions/1.0.1%2Bmc1.17.1/indium-1.0.1%2Bmc1.17.1.jar",
    "https://cdn.modrinth.com/data/yBW8D80W/versions/2.1.0%2B1.17/lambdynamiclights-2.1.0%2B1.17.jar",
    "https://cdn.modrinth.com/data/P7dR8mSH/versions/0.46.1%2B1.17/fabric-api-0.46.1%2B1.17.jar",
    "https://cdn.modrinth.com/data/PRN43VSY/versions/0.4%2B1.17/animatica-0.4%2B1.17.jar",
    "https://cdn.modrinth.com/data/PtjYWJkn/versions/1OzghAbl/sodium-extra-0.4.18%2Bmc1.17.1-build.97.jar",
    "https://cdn.modrinth.com/data/Bh37bMuy/versions/r2sBtu0R/reeses_sodium_options-1.5.0%2Bmc1.17.1-build.69.jar",
    "https://cdn.modrinth.com/data/LQ3K71Q1/versions/v2.0.6/dynamic-fps-2.0.6.jar",
    "https://cdn.modrinth.com/data/AANobbMI/versions/mc1.17.1-0.3.4/sodium-fabric-mc1.17.1-0.3.4%2Bbuild.13.jar"
    ]

def get_mc_path():
    homePath = os.path.expanduser("~")
    
    match PLATFORM:
        case 'Windows':
            # Windows default at: %APPDATA%\.minecraft
            homePath = os.getenv('APPDATA') # Override homepath to use roaming folder on Windows
            minecraft_dir = path.join(homePath, '.minecraft')
        case 'Linux':
            # UNIX default at: ~/.minecraft
            minecraft_dir = path.join(homePath, '.minecraft')
        case 'macOS':
            # macOS default at: ~/Library/Application Support/minecraft
            minecraft_dir = path.join(homePath, 'Library', 'Application Support', 'minecraft')

    # os.path.join handles platform-specific paths  
    mods_dir = path.join(minecraft_dir, 'mods')
    saves_dir = path.join(minecraft_dir, 'saves')
    resources_dir = path.join(minecraft_dir, 'resourcepacks')
    return minecraft_dir, saves_dir, mods_dir, resources_dir

def get_map_file(saves_path):
    print(f'Downloading map file to {saves_path}')
    download_path = path.join(saves_path, DREHMAL_VERSION_NAME) # Final map folder path + name
    shard_path = path.join(saves_path, f'shards-{DREHMAL_VERSION_FILENAME}') # Temporary map shard folder
    # Create temp shard download folder
    if not os.path.exists(shard_path): os.makedirs(shard_path)
    # Loop through each shard and download them
    for i, source in enumerate(DREHMAL_DOWNLOAD_SOURCES['drehmal.net']):
        print(f'Downloading drehmal.net shard #{i+1}')
        curr_shard_path = path.join(shard_path, f'{DREHMAL_VERSION_FILENAME}-{i}.tar.gz')
        response = requests.get(source)
        open(curr_shard_path, "wb").write(response.content)
    print(f'Map shards successfully downloaded')
    print(f'Extracting shards')
    # Extract each individual map shard into users' save folder
    extract_split(shard_path, download_path)
    print(f'Map successfully downloaded and extracted')
    print(f'Cleaning up files')
    try: # Remove shard folder
        shutil.rmtree(shard_path)
    except OSError as e: # Print error
        print(f'Error encountered: {e.filename} {e.strerror}')

def get_resource_pack(resource_path):
    print(f'Downloading resourcepack')
    file_name = f'Drehmal Pack.zip'
    
    response = requests.get(RESOURCE_PACK_URL)
    open(path.join(resource_path, file_name), "wb").write(response.content)
    print(f'Resource pack successfully dodwnloaded')

def install_fabric(minecraft_path):
    print(f'Downloading Fabric installer')
    download_path = 'fabric-installer.jar'
    response = requests.get(FABRIC_INSTALLER_URL)
    open(download_path, "wb").write(response.content)
    print(f'Installing Fabric')
    subprocess.call(['java', '-jar', download_path, 'client', '-dir', f'{minecraft_path}', '-mcversion', '1.17.1'])
    print(f'Fabric successfully installed')
    print(f'Cleaning up files')
    if os.path.exists(download_path): os.remove(download_path)

def get_mods(mods_path):
    print(f'Downloading mods')
    for url in MODS_LIST:
        file_name = url.split('/')[-1]
        print(f'Downloading {file_name}')
        response = requests.get(url)
        open(path.join(mods_path, file_name), "wb").write(response.content)
    print(f'Mods successfully downloaded')

def updated_launcher_profile(minecraft_path):
    mc_profile_file = path.join(minecraft_path, 'launcher_profiles.json')
    mc_options_file = path.join(minecraft_path, 'options.txt')
    
    # Updated Fabric 1.17.1 profile with Drehmal info
    print(f'Updating Minecraft launcher profile')
    with open(mc_profile_file, 'r+') as f:
        data = json.load(f)
        data['profiles']['fabric-loader-1.17.1']['name'] = DREHMAL_VERSION_NAME
        data['profiles']['fabric-loader-1.17.1']['icon'] = DREHMAL_ICON_BASE64
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
    # Add resource pack to top of the load order
    print(f'Updating resource pack order')
    with open(mc_options_file, 'r+') as f:
        options = f.readlines()
        index = options.index(next((s for s in options if 'resourcePacks:' in s), None))
        options[index] = 'resourcePacks:["vanilla","Fabric Mods","file/Drehmal Pack.zip"]\n'
        f.seek(0)
        f.writelines(options)
        f.truncate()

def main():
    # Get default paths based on user operating system
    minecraft_folder, saves_folder, mods_folder, resource_folder = get_mc_path()
    print('Using the following paths\n' + 
          f'Minecraft folder: {minecraft_folder}\n' + 
          f'World folder: {saves_folder}\n' + 
          f'Mods folder: {mods_folder}\n' + 
          f'Resource packs folder: {resource_folder}')
    
    # Download map file, extract it
    get_map_file(saves_folder)
    
    # # Download resource pack, extract it
    get_resource_pack(resource_folder)
    
    # Downloading Fabric
    install_fabric(minecraft_folder)
    
    # Downloading mods
    get_mods(mods_folder)
    
    # Updating launcher profile
    updated_launcher_profile(minecraft_folder)
    
    print('Installation complete! Enjoy =)')
    print('This window can be safely closed, or will close in 60s.')
    sleep(60)
    
if __name__ == "__main__":
    main()