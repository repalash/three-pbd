import {BaseBody3d} from "../bodies/BaseBody3d";
import {Vector3} from "three";
import {BaseBendingConstraint3d} from "./BaseBendingConstraint3d";

export class BendingConstraint3d extends BaseBendingConstraint3d {
    private readonly i0: number;
    private readonly i1: number;
    private readonly i2: number;

    constructor(public readonly body0: BaseBody3d, i0: number, i1: number, i2: number, stiffness: number) {
        super(stiffness);
        this.i0 = i0;
        this.i1 = i1;
        this.i2 = i2;
        this.restLength = new Vector3()
            .add(body0.predicted[i0]).add(body0.predicted[i1]).add(body0.predicted[i2])
            .divideScalar(3)
            .distanceTo(body0.predicted[i2]);
    }

    public constrainPositions(di: number): void {
        let corr = this.getCorrection(this.body0.predicted[this.i0], this.body0.predicted[this.i1], this.body0.predicted[this.i2]);
        corr.multiplyScalar(di / 2.0)

        this.body0.predicted[this.i0].add(corr);
        this.body0.predicted[this.i1].add(corr);
        this.body0.predicted[this.i2].sub(corr.multiplyScalar(2.0));
    }
}