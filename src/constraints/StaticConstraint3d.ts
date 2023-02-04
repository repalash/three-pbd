import {Constraint3d} from "./Constraint3d";
import {Vector3} from "three";
import {BaseBody3d} from "../bodies/BaseBody3d";

export class StaticConstraint3d extends Constraint3d {
    private readonly i0: number;
    private position: Vector3;

    constructor(body: BaseBody3d, i: number = 0) {
        super(body);
        this.i0 = i;
        this.position = body.positions[i].clone();
    }

    public constrainPositions(_: number): void {
        this.body0.positions[this.i0].copy(this.position);
        this.body0.predicted[this.i0].copy(this.position);
    }

    public constrainVelocities(): void {
    }
}