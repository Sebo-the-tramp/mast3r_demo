# Gaussian Splats Web Viewer Demo

This repository contains a web-based demo for viewing Gaussian Splats using Three.js. The demo loads PLY files containing 3D Gaussian splats and displays them in an interactive web environment.

## Overview

This demo showcases:
- Loading Gaussian Splat PLY files directly in the browser
- Interactive camera controls for exploring the 3D scene
- First-person navigation (WASD/arrow keys) and mouse look controls
- On-screen buttons for mobile compatibility

## Usage

1. Clone this repository
2. Host the files on a web server (or use a tool like `python -m http.server`)
3. Open `index.html` in your browser
4. Your PLY file will be loaded and displayed automatically

## Transforming Gaussian Splats

If you need to transform your Gaussian Splats (scaling, rotation, etc.), we use an external repository for this purpose. Please follow these steps:

1. Visit the [gaussian-splats-transformation](https://github.com/yzslab/gaussian-splatting-lightning) repository
2. Follow their README for installation instructions
3. Use their transformation tools as described in their documentation

Example transformation commands from that repository:

```bash
# Scale the model by 2.0
python transform_gaussian_splats.py splat.ply scaled_splat.ply --scale 2.0

# Rotate around Y axis by 90 degrees
python transform_gaussian_splats.py splat.ply rotated_splat.ply --rotate-y 90

# Combined transformation with visualization
python transform_gaussian_splats.py splat.ply transformed_splat.ply --scale 1.5 --rotate-x 30 --rotate-y 45 --rotate-z 15 --visualize
```

After transforming your PLY file, you can load it in this web viewer.

## Controls

- **WASD/Arrow Keys**: Move around
- **Space**: Jump
- **Mouse**: Look around
- **ESC**: Exit pointer lock mode
- **UI Buttons**: Alternative controls for rotation, scaling, and movement

## Requirements

- Modern browser with WebGL support
- For transforming PLY files: Python with dependencies from the transformation repository

## Notes

1. Performance depends on the size and complexity of the Gaussian Splat model
2. The viewer is designed to work with PLY files produced by Gaussian Splatting implementations
3. Pre-transformed files load faster and perform better than applying transformations at runtime 