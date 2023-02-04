import {CollisionContact3d} from "./CollisionContact3d";
import {Body3d} from "../bodies/Body3d";
import {Vector3} from "three";

export class BodyBodyContact3d extends CollisionContact3d {
    private readonly diameter: number;
    private readonly diameter2: number;
    private readonly mass0: number;
    private readonly mass1: number;

    constructor(private readonly body0: Body3d, private readonly i0: number, private readonly body1: Body3d, private readonly i1: number) {
        super();
        this.diameter = this.body0.particleRadius + this.body1.particleRadius;
        this.diameter2 = this.diameter * this.diameter;
        const sum = this.body0.particleMass + this.body1.particleMass;
        this.mass0 = this.body0.particleMass / sum;
        this.mass1 = this.body1.particleMass / sum;

    }

    public resolveContact(di: number): void {
        const normal = new Vector3().subVectors(this.body0.predicted[this.i0], this.body1.predicted[this.i1]);
        const sqLen = normal.lengthSq();
        if (sqLen <= this.diameter2 && sqLen > 1e-9) {
            const len = Math.sqrt(sqLen);
            normal.divideScalar(len);
            const delta = normal.multiplyScalar(di * (this.diameter - len));
            this.body0.predicted[this.i0].addScaledVector(delta, this.mass0)
            this.body0.positions[this.i0].addScaledVector(delta, this.mass0)
            this.body1.predicted[this.i1].addScaledVector(delta, -this.mass1)
            this.body1.positions[this.i1].addScaledVector(delta, -this.mass1)
        }
    }
}