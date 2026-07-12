from pathlib import Path
from PIL import Image


OUT_DIR = Path(r"D:\English\kids\picture_vocab_img\v1")
SOURCE = OUT_DIR / "picture_vocab_contact_sheet.png"
NAMES = [
    "apartment", "bakery", "bathroom", "bedroom",
    "living_room", "post_office", "camera", "basket",
    "blanket", "rope", "waterfall", "pond",
]


image = Image.open(SOURCE).convert("RGB")
width, height = image.size

for index, name in enumerate(NAMES):
    row, column = divmod(index, 4)
    left = round(column * width / 4)
    right = round((column + 1) * width / 4)
    top = round(row * height / 3)
    bottom = round((row + 1) * height / 3)
    cell = image.crop((left, top, right, bottom))
    cell.save(OUT_DIR / f"{name}.png", optimize=True)

print(f"source={width}x{height}")
print(f"created={len(NAMES)}")
for name in NAMES:
    path = OUT_DIR / f"{name}.png"
    with Image.open(path) as item:
        print(f"{path.name}\t{item.width}x{item.height}\t{path.stat().st_size}")
