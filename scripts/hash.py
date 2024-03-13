import hashlib
import os

def hash_directory(directory):
    sha_hash = hashlib.sha256()
    for root, dirs, files in os.walk(directory):
        for names in files:
            filepath = os.path.join(root, names)
            try:
                with open(filepath, "rb") as f:
                    for chunk in iter(lambda: f.read(4096), b""):
                        sha_hash.update(chunk)
            except IOError:
                # the file access might've changed till the attempt to open it
                continue

    return sha_hash.hexdigest()

# usage
original_hash = hash_directory('./map')
print(original_hash)
downloaded_hash = hash_directory('./Drehmal 2.2 Apotheosis Beta 1.3.1')
print(downloaded_hash)

print(original_hash == downloaded_hash)
