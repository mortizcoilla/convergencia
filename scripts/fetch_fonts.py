# Descarga las fuentes variable (subset latin) de Google Fonts para self-hosting.
import re
import urllib.request
from pathlib import Path

FONTS_DIR = Path(__file__).parent.parent / "public" / "fonts"
FONTS_DIR.mkdir(parents=True, exist_ok=True)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

SPECS = [
    ("https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap",
     "manrope-var.woff2"),
    ("https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,400..700&display=swap",
     "lora-italic-var.woff2"),
]

for css_url, filename in SPECS:
    req = urllib.request.Request(css_url, headers={"User-Agent": UA})
    css = urllib.request.urlopen(req, timeout=30).read().decode()

    # Bloques @font-face separados por comentario /* subset */
    blocks = re.findall(r"/\*\s*([a-z-]+)\s*\*/\s*@font-face\s*\{[^}]*\}", css)
    urls = re.findall(r"/\*\s*([a-z-]+)\s*\*/\s*@font-face\s*\{[^}]*?url\((https://[^)]+)\)", css)

    latin_url = next((u for subset, u in urls if subset == "latin"), None)
    if not latin_url:
        raise SystemExit(f"No se encontró subset latin en {css_url}")

    req = urllib.request.Request(latin_url, headers={"User-Agent": UA})
    data = urllib.request.urlopen(req, timeout=60).read()
    out = FONTS_DIR / filename
    out.write_bytes(data)
    print(f"{filename}: {len(data)} bytes (subset latin)")
