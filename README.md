# Gaussian Splats Transformation Tool

This repository contains tools for transforming Gaussian Splats stored in PLY format. The tools allow you to scale and rotate your Gaussian Splats before loading them in your web application.

## Requirements

Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Scripts

Two different scripts are provided:

### 1. transform_splats.py

This script uses Open3D and is a general-purpose point cloud transformation tool. It works for most PLY files but might not handle all specific fields in Gaussian Splats files.

```bash
python transform_splats.py input.ply output.ply --scale 2.0 --rotate-x 0 --rotate-y 45.0 --rotate-z 0
```

### 2. transform_gaussian_splats.py

This is a specialized script for Gaussian Splats that directly manipulates the PLY file structure, preserving all attributes. It also includes a visualization option.

```bash
python transform_gaussian_splats.py input.ply output.ply --scale 2.0 --rotate-x 0 --rotate-y 45.0 --rotate-z 0 --visualize
```

## Usage Examples

### Basic scaling

Double the size of the point cloud:

```bash
python transform_gaussian_splats.py splat.ply scaled_splat.ply --scale 2.0
```

### Rotation

Rotate the model 90 degrees around Y axis:

```bash
python transform_gaussian_splats.py splat.ply rotated_splat.ply --rotate-y 90
```

### Rotation around multiple axes

Rotate the model around all three axes:

```bash
python transform_gaussian_splats.py splat.ply rotated_splat.ply --rotate-x 30 --rotate-y 45 --rotate-z 15
```

### Combined transformations

Scale and rotate at the same time:

```bash
python transform_gaussian_splats.py splat.ply transformed_splat.ply --scale 1.5 --rotate-y 45
```

### With visualization

Add the `--visualize` flag to see a preview of the transformation:

```bash
python transform_gaussian_splats.py splat.ply transformed_splat.ply --scale 1.5 --rotate-x 30 --rotate-y 45 --rotate-z 15 --visualize
```

## Important Notes

1. The scripts handle position data and scale attributes, but rotation of Gaussian Splat orientations is complex and might require format-specific handling.

2. Always backup your original PLY files before transforming.

3. If you encounter issues with the Open3D-based script, try the specialized `transform_gaussian_splats.py` which gives more direct control over the file format.

4. For very large PLY files, these scripts might require significant memory.

5. The rotation applies Euler angles in XYZ order: first around X axis, then around Y axis, then around Z axis.

## Integration with Web Application

After transforming your splat file, replace `splat.ply` in your web application with the transformed file. This eliminates the need for runtime transformation in JavaScript, which can be more efficient. 