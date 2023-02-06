import {Constraint3d} from "./Constraint3d";
import {Vector3} from "three";

export abstract class BaseDistanceConstraint3d extends Constraint3d {
    protected restLength: number;

    protected constructor(private compressionStiffness: number, private stretchStiffness: number) {
        super();
    }

    public getCorrection(p1: Vector3, p2: Vector3): Vector3 {
        let n = new Vector3().subVectors(p2, p1);
        let d = n.length();
        n.normalize();

        let corr = n.multiplyScalar(d - this.restLength);
        if (d < this.restLength)
            corr.multiplyScalar(this.compressionStiffness);
        else
            corr.multiplyScalar(this.stretchStiffness);

        return corr;
    }

}