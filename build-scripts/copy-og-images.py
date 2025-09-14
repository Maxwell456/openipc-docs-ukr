import os
import shutil

src_dir = ".cache/plugin/social"
dst_dir = "docs/images/social"
os.makedirs(dst_dir, exist_ok=True)

for fname in os.listdir(src_dir):
    if fname.endswith(".png"):
        slug = fname[:8]  # или другое правило, как привязать к названию страницы
        dst_path = os.path.join(dst_dir, fname)
        shutil.copyfile(os.path.join(src_dir, fname), dst_path)
        print(f"Copied: {dst_path}")
