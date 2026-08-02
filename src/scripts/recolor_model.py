"""
Method B recolour — assigns warm architectural palette to the GLB model
based on each material's current brightness heuristic.
"""
import sys, subprocess

for pkg in ["trimesh", "numpy"]:
    try:
        __import__(pkg)
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

SRC = r"C:\Users\sawan\OneDrive\Desktop\Bday_gift\portfolio\src\projects\riverside-pavillion\model.glb"

# Warm architectural palette (glTF baseColorFactor 0..1 RGBA)
CONCRETE = [0.84, 0.80, 0.75, 1.0]   # warm cream concrete
WOOD     = [0.70, 0.51, 0.34, 1.0]   # timber
DARK     = [0.20, 0.18, 0.15, 1.0]   # warm charcoal
GLASS    = [0.59, 0.70, 0.72, 0.55]  # cool glass tint
TERRA    = [0.72, 0.33, 0.20, 1.0]   # terracotta accent

print(f"Loading {SRC} ...")
scene = trimesh.load(SRC)
geoms = list(scene.geometry.items())
print(f"Found {len(geoms)} geometries")

for i, (name, g) in enumerate(geoms):
    # Skip non-mesh geometry (Path3D, PointCloud, etc.) — no .visual.material
    if not hasattr(g, "visual"):
        print(f"  [{i:02d}] {name[:40]:<40} SKIP (no visual)")
        continue

    m   = getattr(g.visual, "material", None)
    bc  = getattr(m, "baseColorFactor", None) if m else None

    if bc is None:
        lum = 1.0
    else:
        c = np.array(bc[:3], dtype=float)
        c = c / 255.0 if c.max() > 1.0 else c
        lum = float(c.mean())

    if lum > 0.80:     col, rough = GLASS,    0.15
    elif lum < 0.15:   col, rough = DARK,     0.85
    elif lum < 0.45:   col, rough = WOOD,     0.75
    else:              col, rough = CONCRETE, 0.82

    g.visual.material = PBRMaterial(
        baseColorFactor=col, metallicFactor=0.0, roughnessFactor=rough)
    label = 'GLASS' if col is GLASS else 'DARK' if col is DARK else 'WOOD' if col is WOOD else 'CONCRETE'
    print(f"  [{i:02d}] {name[:40]:<40} lum={lum:.2f} -> {label}")

# Add terracotta accent to a handful of elements for visual interest
accent_indices = [0, len(geoms)//3, len(geoms)*2//3]
for idx in accent_indices:
    if idx < len(geoms):
        geoms[idx][1].visual.material = PBRMaterial(
            baseColorFactor=TERRA, metallicFactor=0.0, roughnessFactor=0.70)
        print(f"  Terracotta accent -> [{idx}] {geoms[idx][0][:40]}")

scene.export(SRC)
print(f"\nDone! Recoloured model saved -> {SRC}")
