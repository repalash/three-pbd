import {Constraint3d} from "./Constraint3d";
import {Vector3} from "three";
import {BaseBody3d} from "../bodies/BaseBody3d";

export class DistanceConstraint3d extends Constraint3d {
    private restLength: number;
    private compressionStiffness: number;
    private stretchStiffness: number;
    private readonly i0: number;
    private readonly i1: number;

    constructor(body: BaseBody3d, i0: number, i1: number, stiffness: number) {
        super(body);
        this.i0 = i0;
        this.i1 = i1;
        this.compressionStiffness = stiffness;
        this.stretchStiffness = stiffness;
        this.restLength = body.predicted[i0].distanceTo(body.predicted[i1]);
    }

    public constrainPositions(di: number): void {
        let mass = this.body0.particleMass;
        let invMass = 1.0 / mass;
        let sum = mass * 2.0;

        let n = new Vector3().subVectors(this.body0.predicted[this.i1], this.body0.predicted[this.i0]);
        let d = n.length();
        n.normalize();

        let corr = n.clone().multiplyScalar((d - this.restLength) * sum);
        if (d < this.restLength)
            corr.multiplyScalar(this.compressionStiffness);
        else
            corr.multiplyScalar(this.stretchStiffness);

        corr.multiplyScalar(invMass * di);

        this.body0.predicted[this.i0].add(corr);
        this.body0.predicted[this.i1].sub(corr);
    }
}
