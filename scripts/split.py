import os
import shutil
import zipfile

def get_size(start_path = '.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size  # size in bytes

def split_directory(path, max_size, output_path):
    current_size = 0
    current_dir = os.path.join(output_path, 'shard_1')
    os.makedirs(current_dir, exist_ok=True)
    dir_counter = 1

    for foldername, subfolders, filenames in os.walk(path):
        for filename in filenames:
            file_path = os.path.join(foldername, filename)
            file_size = os.path.getsize(file_path)
            if current_size + file_size > max_size:
                # Zip the current directory
                print(f'Zipping directory: {current_dir}')
                with zipfile.ZipFile(f'{current_dir}.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for folder, subfolders, files in os.walk(current_dir):
                        for file in files:
                            zipf.write(os.path.join(folder, file),
                                       os.path.relpath(os.path.join(folder, file), current_dir))
                print(f'Zipped directory: {current_dir}')
                shutil.rmtree(current_dir)
                print(f'Removed directory: {current_dir}')

                # Start a new directory
                dir_counter += 1
                current_dir = os.path.join(output_path, f'shard_{dir_counter}')
                os.makedirs(current_dir, exist_ok=True)
                print(f'Started new directory: {current_dir}')
                current_size = 0

            # Copy the file to the new directory
            rel_path = os.path.relpath(foldername, path)
            new_folder = os.path.join(current_dir, rel_path)
            os.makedirs(new_folder, exist_ok=True)
            shutil.copy(file_path, new_folder)
            print(f'Copied file: {file_path} to {new_folder}')
            current_size += file_size

    # Zip the final directory if it contains any files
    if os.listdir(current_dir):
        print(f'Zipping directory: {current_dir}')
        with zipfile.ZipFile(f'{current_dir}.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
            for folder, subfolders, files in os.walk(current_dir):
                for file in files:
                    zipf.write(os.path.join(folder, file),
                               os.path.relpath(os.path.join(folder, file), current_dir))
        print(f'Zipped directory: {current_dir}')
        shutil.rmtree(current_dir)
        print(f'Removed directory: {current_dir}')

# Usage
split_directory('./map', 2500*1024*1024, './parts')
