ef parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output")

    # TODO: support degrees > 1
    parser.add_argument("--sh-degrees", "--sh-degree", "-s", type=int, default=3)
    parser.add_argument("--new-sh-degrees", "--ns", type=int, default=-1)

    # translation
    parser.add_argument("--tx", type=float, default=0)
    parser.add_argument("--ty", type=float, default=0)
    parser.add_argument("--tz", type=float, default=0)

    # rotation in euler angles
    parser.add_argument("--rx", type=float, default=0, help="in radians")
    parser.add_argument("--ry", type=float, default=0, help="in radians")
    parser.add_argument("--rz", type=float, default=0, help="in radians")

    # scale
    parser.add_argument("--scale", type=float, default=1)

    parser.add_argument("--sh-factor", type=float, default=1.0)

    # auto reorient
    parser.add_argument("--auto-reorient", action="store_true", default=False)
    parser.add_argument("--cameras-json", type=str, default=None)

    parser.add_argument("--appearance-id", type=float, default=-1)

    args = parser.parse_args()
    args.input = os.path.expanduser(args.input)
    args.output = os.path.expanduser(args.output)

    # Call the program with the specified arguments
    
python utils.transform_gaussian_splats.py splat_OG.ply splat_scaled.ply --scale 10.0 --rx 180.0 --ry 0.0 --rz 0.0

