import {BodyConstraint3d} from "./Constraint3d";
import {BaseBody3d} from "../bodies/BaseBody3d";
import {Vector3} from "three";

export class BodyDistanceConstraint3d extends BodyConstraint3d {
    private restLength: number;
    private compressionStiffness: number;
    private stretchStiffness: number;

    constructor(body0: BaseBody3d, body1: BaseBody3d, stiffness: number) {
        super(body0, body1);
        this.compressionStiffness = stiffness;
        this.stretchStiffness = stiffness;
        this.restLength = body0.predictedCenterOfMass.distanceTo(body1.predictedCenterOfMass);
    }

    public constrainPositions(di: number): void {
        let mass0 = this.body0.totalMass;
        let mass1 = this.body1.totalMass;
        let invMass0 = 1.0 / mass0;
        let invMass1 = 1.0 / mass1;
        let sum = mass0 + mass1;

        const c0 = this.body0.predictedCenterOfMass;
        const c1 = this.body1.predictedCenterOfMass;

        let n = new Vector3().subVectors(c1, c0);
        let d = n.length();
        n.normalize();

        let corr = n.clone().multiplyScalar((d - this.restLength) * sum);
        if (d < this.restLength)
            corr.multiplyScalar(this.compressionStiffness);
        else
            corr.multiplyScalar(this.stretchStiffness);

        corr.multiplyScalar(di);

        this.body0.addToPredicted(corr, invMass0);
        this.body1.addToPredicted(corr, -invMass1);
    }
}