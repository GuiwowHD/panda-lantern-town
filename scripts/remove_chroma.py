from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np


def remove_background(source: Path, destination: Path, tolerance: int) -> None:
    image = cv2.imread(str(source), cv2.IMREAD_UNCHANGED)
    if image is None:
        raise SystemExit(f"Could not read {source}")
    if image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)

    height, width = image.shape[:2]
    corners = np.array(
        [
            image[0, 0, :3],
            image[0, width - 1, :3],
            image[height - 1, 0, :3],
            image[height - 1, width - 1, :3],
        ],
        dtype=np.float32,
    )
    background = np.median(corners, axis=0)
    distance = np.linalg.norm(image[:, :, :3].astype(np.float32) - background, axis=2)
    candidate = (distance <= tolerance).astype(np.uint8) * 255

    flood_mask = np.zeros((height + 2, width + 2), np.uint8)
    connected = np.zeros((height, width), np.uint8)
    seeds = [
        (0, 0),
        (width - 1, 0),
        (0, height - 1),
        (width - 1, height - 1),
        (width // 2, 0),
        (0, height // 2),
        (width - 1, height // 2),
    ]
    for seed in seeds:
        if connected[seed[1], seed[0]]:
            continue
        cv2.floodFill(
            candidate.copy(),
            flood_mask,
            seed,
            255,
            loDiff=0,
            upDiff=0,
            flags=4 | cv2.FLOODFILL_MASK_ONLY | (255 << 8),
        )

    connected = flood_mask[1:-1, 1:-1]
    alpha = np.where(connected > 0, 0, 255).astype(np.uint8)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    image[:, :, 3] = np.minimum(image[:, :, 3], alpha)

    destination.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(destination), image):
        raise SystemExit(f"Could not write {destination}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--tolerance", type=int, default=95)
    args = parser.parse_args()
    remove_background(args.source, args.destination, args.tolerance)


if __name__ == "__main__":
    main()
