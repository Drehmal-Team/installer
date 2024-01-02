import os
from shutil import copy2, copytree
import tarfile
import os.path
from pathlib import Path
import io, gzip, tarfile
import math

# Use a Mebibyte/Gibibyte converter
SPLIT_FOLDER_LIMIT = 524288000 # In bytes
DREHMAL_VERSION_NAME = 'drehmal-2.2-apotheosis-beta-1.1.0'
# DREHMAL_VERSION_NAME = 'Drehmal 2.2 Apotheosis Beta - 1.0.1'


# from: https://stackoverflow.com/a/1392549
def get_size(start_path = '.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            # skip if it is symbolic link
            if not os.path.islink(fp):
                total_size += os.path.getsize(fp)

    return total_size

def split_folder(src, dest):
    folder_size = 0
    for dir_path, dir_names, file_names in os.walk(src):
        for file in file_names:

            file_path = os.path.join(dir_path, file)
            file_folder = Path(file_path).parents[0]
            file_folder = list(file_folder.parts)
            file_folder.pop(0)
            file_folder = os.path.join('', *file_folder)
            split_path = os.path.join(dest, f'{DREHMAL_VERSION_NAME}-{folder_size//SPLIT_FOLDER_LIMIT}', file_folder)
            if not os.path.exists(split_path): os.makedirs(split_path)
            copy2(file_path, split_path)
            folder_size += os.path.getsize(file_path)
    return dest, folder_size

def split_into(src, dest, num):
    dir_size = get_size(src)
    archive_size = dir_size/num
    print(f'Splitting into {num} archives, size {(archive_size/1024**3)}')
    folder_size = 0
    for dir_path, dir_names, file_names in os.walk(src):
        for file in file_names:

            file_path = os.path.join(dir_path, file)
            file_folder = Path(file_path).parents[0]
            file_folder = list(file_folder.parts)
            file_folder.pop(0)
            file_folder = os.path.join('', *file_folder)
            split_path = os.path.join(dest, f'{DREHMAL_VERSION_NAME}-{folder_size//archive_size}', file_folder)
            if not os.path.exists(split_path): os.makedirs(split_path)
            copy2(file_path, split_path)
            folder_size += os.path.getsize(file_path)

def compress_split(output_dir, source_dir):
    if not os.path.exists(output_dir): os.makedirs(output_dir)
    with os.scandir(path=source_dir) as dir:
        for entry in dir:
            tar_file = os.path.join(output_dir, entry.name) + '.tar.gz'
            print(f'Compressing {entry.name}, {entry.path} to {tar_file}')
            with tarfile.open(tar_file, "w:gz") as tar:
                tar.add(entry.path, arcname='')
    print('Compression complete')

"""
iterate through map folder
  get the path
  copy file into a split folder
  compress that split folder
  if split folder size >= archive size: folder_num++
"""
def compress_into(src, dest, max_size=None, num=None):
    dir_size = get_size(src)
    archives = 0
    split_size = 0

    if max_size:
        archives = math.ceil(dir_size / max_size)
        split_size = dir_size / num
    else:
        archives = num
        split_size = dir_size / num

    print(f'Splitting into {archives} archives of size {(split_size/1024**2):.2f}MB')

    folder_size = 0
    tar_size = 0
    check_every_size = split_size/10
    check_size_count = 0
    file_count = 0
    curr_index = 1
    for dir_path, dir_names, file_names in os.walk(src):
        for file in file_names:
            file_count += 1

            file_path = os.path.join(dir_path, file)
            file_folder = list(Path(file_path).parents[0].parts)
            file_folder.pop(0)
            file_folder = os.path.join('', *file_folder)

            split_folder_path = os.path.join(dest, f'{DREHMAL_VERSION_NAME}-{curr_index}')
            split_path = os.path.join(split_folder_path, file_folder)
            tar_file = split_folder_path + '.tar.gz'

            if (os.path.isfile(tar_file)): tar_size = os.path.getsize(tar_file)
            else: tar_size = 0
            folder_size += os.path.getsize(file_path)
            file_size = os.path.getsize(file_path)
            check_size_count += file_size
            if not os.path.exists(split_path): os.makedirs(split_path)

            if (tar_size + check_size_count) >= split_size:
                print(f'Incrementing index. Size: {(tar_size/1024**2):.2f}MB (Compressed) + {(check_size_count/1024**2):.2f}MB (Raw) = Estimated {((tar_size+check_size_count)/1024**2):.2f}MB')
                with tarfile.open(tar_file, "w:gz") as tar:
                    tar.add(split_folder_path, arcname='')
                check_size_count = 0
                curr_index += 1
                folder_size = 0

            copy2(file_path, split_path)

            if check_size_count >= check_every_size:

              with tarfile.open(tar_file, "w:gz") as tar:
                  tar.add(split_folder_path, arcname='')

              print(f'Index: {curr_index} | Files: {file_count} | File Size: {(file_size/1024**2):.2f}MB | Check size: {(check_size_count/1024**2):.2f}MB | Current tar: {(tar_size/1024**2):.2f}MB (from {(folder_size/1024**2):.2f}MB)')
              check_size_count = 0

            else:
              print(f'Index: {curr_index} | Files: {file_count} | File Size: {(file_size/1024**2):.2f}MB | Check size: {(check_size_count/1024**2):.2f}MB')
              pass

def extract_split(source_dir, output_file):
    with os.scandir(path=source_dir) as dir:
        for entry in dir:
            print(f'Extracting {entry.name}')
            with tarfile.open(entry.path, 'r:gz') as tar:
                tar.extractall(output_file)

SRC_DIR = 'map'
DEST_DIR = 'split'
ARCHIVE_FILE = 'archived.tar.gz'
ARCHIVE_DIR = 'archive'

def main():
    print(f'Reading size of {SRC_DIR}')
    mb_size = get_size(SRC_DIR) / 1024**2
    gb_size = get_size(SRC_DIR) / 1024**3
    print(gb_size, 'gibibytes')
    print(f'Folder size read as {mb_size:.2f}MB / {gb_size:.2f}GB')

    # split_folder(src=SRC_DIR, dest=DEST_DIR)
    # split_into(src=SRC_DIR, dest=DEST_DIR, num=11)
    compress_into(src=SRC_DIR, dest='split_compress2', max_size=SPLIT_FOLDER_LIMIT)

    # compress_split(ARCHIVE_DIR, 'split')

    # extract_split(ARCHIVE_DIR, 'extracted_map')

if __name__ == "__main__":
    main()
