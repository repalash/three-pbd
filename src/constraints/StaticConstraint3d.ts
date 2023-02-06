import {Constraint3d} from "./Constraint3d";
import {Vector3} from "three";
import {BaseBody3d} from "../bodies/BaseBody3d";

export class StaticConstraint3d extends Constraint3d {
    private readonly i0: number;
    private readonly position: Vector3;

    readonly isStatic = true;

    constructor(public readonly body0: BaseBody3d, i: number = 0) {
        super();
        this.i0 = i;
        this.position = body0.positions[i].clone();
    }

    public constrainPositions(_: number): void {
        this.body0.positions[this.i0].copy(this.position);
        this.body0.predicted[this.i0].copy(this.position);
    }

    public constrainVelocities(): void {
    }
}