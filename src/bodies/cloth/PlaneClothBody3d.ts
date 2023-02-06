import {GeometryBody3d} from "../GeometryBody3d";
import {PlaneGeometry} from "three";
import {DistanceConstraint3d} from "../../constraints/DistanceConstraint3d";
import {BendingConstraint3d} from "../../constraints/BendingConstraint3d";

export class PlaneClothBody3d extends GeometryBody3d{
    constructor(geometry: PlaneGeometry, radius: number, mass: number, protected stretchStiffness: number, protected bendStiffness: number) {
        super(geometry, radius, mass);
        this.createConstraints()
    }

    protected createConstraints(): void {
        const plane = this.geometry as PlaneGeometry;
        const width = plane.parameters.widthSegments+1;
        const height = plane.parameters.heightSegments+1;

        // Horizontal
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < (width - 1); x++) {
                this.constraints.push(new DistanceConstraint3d(this, y * width + x, y * width + x + 1, 1));
            }
        }
        // Vertical
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < (height - 1); y++) {
                this.constraints.push(new DistanceConstraint3d(this, y * width + x, (y + 1) * width + x, this.stretchStiffness));
            }
        }
        // Shearing distance constraint
        for (let y = 0; y < (height - 1); y++) {
            for (let x = 0; x < (width - 1); x++) {
                this.constraints.push(new DistanceConstraint3d(this, y * width + x, (y + 1) * width + x + 1, this.stretchStiffness));
                this.constraints.push(new DistanceConstraint3d(this, (y + 1) * width + x, y * width + x + 1, this.stretchStiffness));
            }
        }
        //add vertical constraints
        for (let i = 0; i <= width - 1; i++) {
            for (let j = 0; j < height - 2; j++) {
                const i0 = j * width + i;
                const i1 = (j + 1) * width + i;
                const i2 = (j + 2) * width + i;

                this.constraints.push(new BendingConstraint3d(this, i0, i1, i2, this.bendStiffness));
            }
        }
        //add horizontal constraints
        for (let i = 0; i < width - 2; i++) {
            for (let j = 0; j <= height - 1; j++) {
                const i0 = j * width + i;
                const i1 = j * width + (i + 1);
                const i2 = j * width + (i + 2);

                this.constraints.push(new BendingConstraint3d(this, i0, i1, i2, this.bendStiffness));
            }
        }
    }

}