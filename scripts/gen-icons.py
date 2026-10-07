#!/usr/bin/env python3
"""Generate Habit It's original pixel-art app icons (stdlib only).

Design: 16x16 grid — ink border, primary fill, mint check mark,
sunny sparkle. No external artwork, no dependencies.
Run: python3 scripts/gen-icons.py
"""

import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "icons"

INK = (45, 42, 50, 255)
PRIMARY = (108, 92, 231, 255)
MINT = (119, 221, 119, 255)
MINT_DARK = (84, 182, 84, 255)
SUNNY = (255, 179, 71, 255)

# Check mark pixels (x, y) on the 16x16 grid, with a darker lower row.
CHECK = [(4, 8), (5, 9), (6, 10), (7, 9), (8, 8), (9, 7), (10, 6), (11, 5)]
SPARKLE = [(2, 2), (3, 2), (2, 3), (3, 3)]


def build_grid(border: bool) -> list:
    grid = [[PRIMARY for _ in range(16)] for _ in range(16)]
    if border:
        for i in range(16):
            grid[0][i] = INK
            grid[15][i] = INK
            grid[i][0] = INK
            grid[i][15] = INK
    for x, y in CHECK:
        grid[y][x] = MINT
        if y + 1 < 16:
            grid[y + 1][x] = MINT_DARK
    for x, y in SPARKLE:
        grid[y][x] = SUNNY
    return grid


def render(grid: list, size: int) -> bytes:
    n = len(grid)
    px = bytearray()
    for ty in range(size):
        for tx in range(size):
            px += bytes(grid[ty * n // size][tx * n // size])
    return bytes(px)


def png_bytes(w: int, h: int, rgba: bytes) -> bytes:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    raw = b"".join(b"\x00" + rgba[y * w * 4 : (y + 1) * w * 4] for y in range(h))
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(raw))
        + chunk(b"IEND", b"")
    )


def ico_bytes(entries: list) -> bytes:
    """entries: [(size, png_data)] — PNG-compressed ICO (widely supported)."""
    out = [struct.pack("<HHH", 0, 1, len(entries))]
    offset = 6 + 16 * len(entries)
    for size, data in entries:
        dim = size if size < 256 else 0
        out.append(
            struct.pack("<BBBBHHII", dim, dim, 0, 0, 1, 32, len(data), offset)
        )
        offset += len(data)
    for _, data in entries:
        out.append(data)
    return b"".join(out)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    grid = build_grid(border=True)

    files = {
        "icon-192.png": 192,
        "icon-512.png": 512,
        "apple-touch-icon.png": 180,
        "favicon-32.png": 32,
    }
    pngs = {}
    for name, size in files.items():
        data = png_bytes(size, size, render(grid, size))
        (OUT / name).write_bytes(data)
        pngs[name] = data
        print(f"wrote public/icons/{name}")

    # Maskable: safe-zone friendly (art on plain primary canvas, no border).
    inner = render(build_grid(border=False), 410)
    canvas = bytearray(PRIMARY * 512 * 512)
    off = (512 - 410) // 2
    for y in range(410):
        row = inner[y * 410 * 4 : (y + 1) * 410 * 4]
        start = ((off + y) * 512 + off) * 4
        canvas[start : start + 410 * 4] = row
    (OUT / "maskable-512.png").write_bytes(png_bytes(512, 512, bytes(canvas)))
    print("wrote public/icons/maskable-512.png")

    # Multi-size ICO for browsers + Next.js favicon slot.
    p16 = png_bytes(16, 16, render(grid, 16))
    p32 = pngs["favicon-32.png"]
    (ROOT / "app" / "favicon.ico").write_bytes(ico_bytes([(16, p16), (32, p32)]))
    print("wrote app/favicon.ico")


if __name__ == "__main__":
    main()
