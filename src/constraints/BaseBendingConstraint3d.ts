import {Constraint3d} from "./Constraint3d";
import {Vector3} from "three";

export abstract class BaseBendingConstraint3d extends Constraint3d {
    protected restLength: number;

    protected constructor(private stiffness: number) {
        super();
    }

    public getCorrection(p1: Vector3, p2: Vector3, p3: Vector3): Vector3 {
        const dirCenter = new Vector3().add(p1).add(p2).add(p3).divideScalar(3).sub(p3);
        const diff = 1 - (this.restLength / dirCenter.length());
        return dirCenter.multiplyScalar(-diff * this.stiffness);
    }
}

