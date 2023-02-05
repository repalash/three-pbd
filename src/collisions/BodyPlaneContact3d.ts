import {CollisionContact3d} from "./CollisionContact3d";
import {Vector3} from "three";
import {BaseBody3d} from "../bodies/BaseBody3d";

// https://github.com/Scrawk/Position-Based-Dynamics/blob/master/Assets/PositionBasedDynamics/Scripts/Collisions/BodyPlaneContact3d.cs

export class BodyPlaneContact3d extends CollisionContact3d {

    constructor(private readonly body: BaseBody3d, private readonly i0: number, private readonly normal: Vector3, private readonly distance: number) {
        super();
    }
    public resolveContact(di: number): void {
        const d = this.normal.dot(this.body.predicted[this.i0]) - this.distance - this.body.particleRadius;

        if (d < 0.0) {
            this.body.predicted[this.i0].addScaledVector(this.normal, -d * di);
            this.body.positions[this.i0].addScaledVector(this.normal, -d * di);
        }
    }
}