# Corrige imágenes del sitio:
# - og-image: JPEG disfrazado de .png, 1376x768 -> JPEG real 1200x630
# - equipo: 2 JPEG disfrazados de .webp, 1024px -> WebP real 800px
# - genera logo.png (512) y apple-touch-icon.png (180) desde el isotipo
from PIL import Image, ImageDraw
from pathlib import Path

ROOT = Path(__file__).parent.parent
IMG = ROOT / "public" / "images"

INK = (8, 27, 58)        # #081B3A
CREAM = (243, 232, 220)  # #F3E8DC
TERRA = (201, 107, 75)   # #C96B4B

# --- 1. og-image -> JPEG real 1200x630 ---
src = Image.open(IMG / "og-image.png").convert("RGB")
w, h = src.size
target_ratio = 1200 / 630
if w / h > target_ratio:  # demasiado ancha -> recortar lados
    new_w = int(h * target_ratio)
    x0 = (w - new_w) // 2
    src = src.crop((x0, 0, x0 + new_w, h))
else:                     # demasiado alta -> recortar arriba/abajo
    new_h = int(w / target_ratio)
    y0 = (h - new_h) // 2
    src = src.crop((0, y0, w, y0 + new_h))
og = src.resize((1200, 630), Image.LANCZOS)
og.save(IMG / "og-image.jpg", "JPEG", quality=82, optimize=True, progressive=True)
(IMG / "og-image.png").unlink()
print("og-image.jpg", og.size, (IMG / "og-image.jpg").stat().st_size, "bytes")

# --- 2. equipo -> WebP real 800px ---
for name in ["tania-morales", "tania-gamboa", "claudia-ortiz"]:
    p = IMG / "team" / f"{name}.webp"
    im = Image.open(p).convert("RGB")
    if max(im.size) > 800:
        im = im.resize((800, 800), Image.LANCZOS)
    im.save(p, "WEBP", quality=80, method=6)
    print(p.name, im.size, p.stat().st_size, "bytes")

# --- 3. logo.png 512 + apple-touch-icon.png 180 (isotipo: C + punto) ---
def draw_iso(size: int, bg, stroke, dot) -> Image.Image:
    s = size / 100.0
    im = Image.new("RGB", (size, size), bg)
    d = ImageDraw.Draw(im)
    # C: círculo centro (58.3, 50) r=38, abierto a la derecha (±47.4°)
    cx, cy, r = 58.3 * s, 50 * s, 38 * s
    bbox = [cx - r, cy - r, cx + r, cy + r]
    d.arc(bbox, start=47.4, end=312.6, fill=stroke, width=max(1, round(8 * s)))
    # punto terracota en (78, 14) r=8
    dx, dy, dr = 78 * s, 14 * s, 8 * s
    d.ellipse([dx - dr, dy - dr, dx + dr, dy + dr], fill=dot)
    return im

logo = draw_iso(512, CREAM, INK, TERRA)
logo.save(IMG / "logo.png", "PNG", optimize=True)
print("logo.png", logo.size, (IMG / "logo.png").stat().st_size, "bytes")

apple = draw_iso(180, CREAM, INK, TERRA)
apple.save(ROOT / "public" / "apple-touch-icon.png", "PNG", optimize=True)
print("apple-touch-icon.png", apple.size, (ROOT / "public" / "apple-touch-icon.png").stat().st_size, "bytes")
