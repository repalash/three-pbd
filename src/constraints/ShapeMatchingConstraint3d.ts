// https://github.com/Scrawk/Position-Based-Dynamics/blob/master/Assets/PositionBasedDynamics/Scripts/Constraints/ShapeMatchingConstraint3d.cs
import {Constraint3d} from "./Constraint3d";
import {Matrix3, Vector3} from "three";
import {Matrix3Decomposition} from "../math/Matrix3Decomposition";

export class ShapeMatchingConstraint3d extends Constraint3d {

    private invRestMatrix: Matrix3 = new Matrix3().identity();

    private restCm: Vector3 = new Vector3();

    private restPositions: Vector3[] = [];

    constructor(body: any, mass: number, private stiffness: number = 0) {
        super(body);

        let wsum = 0.0;

        for (let pos of body.positions) {
            this.restCm.add(pos.clone().multiplyScalar(mass));
            wsum += mass;
        }

        this.restCm.divideScalar(wsum);

        let A = new Matrix3();

        for (let pos of body.positions) {

            let q = pos.clone().sub(this.restCm);

            A.elements[0] += mass * q.x * q.x;
            A.elements[1] += mass * q.x * q.y;
            A.elements[2] += mass * q.x * q.z;

            A.elements[3] += mass * q.y * q.x;
            A.elements[4] += mass * q.y * q.y;
            A.elements[5] += mass * q.y * q.z;

            A.elements[6] += mass * q.z * q.x;
            A.elements[7] += mass * q.z * q.y;
            A.elements[8] += mass * q.z * q.z;

            this.restPositions.push(q);

        }

        this.invRestMatrix.copy(A).invert();

    }

    constrainPositions(di: number) {

        let cm = new Vector3();
        let wsum = 0.0;
        let mass = this.body0.particleMass;

        for (let pos of this.body0.predicted) {
            cm.add(pos.clone().multiplyScalar(mass));
            wsum += mass;
        }

        cm.divideScalar(wsum);

        const A = new Matrix3();

        for (let i = 0; i < this.body0.numParticles; i++) {

            const q = this.restPositions[i];
            const p = this.body0.positions[i].clone().sub(cm);

            A.elements[0] += mass * p.x * q.x;
            A.elements[1] += mass * p.x * q.y;
            A.elements[2] += mass * p.x * q.z;

            A.elements[3] += mass * p.y * q.x;
            A.elements[4] += mass * p.y * q.y;
            A.elements[5] += mass * p.y * q.z;

            A.elements[6] += mass * p.z * q.x;
            A.elements[7] += mass * p.z * q.y;
            A.elements[8] += mass * p.z * q.z;
        }

        A.multiply(this.invRestMatrix);

        // const eps = 1e-6;
        const R = new Matrix3();
        // A.polarDecomposition(R, eps); // todo;
        //Matrix3x3d R, U, D;
        // R.copy(A);

        const U = new Matrix3();
        const D = new Matrix3();
        Matrix3Decomposition.PolarDecomposition(A, R, U, D);

        for (let i = 0; i < this.body0.numParticles; i++) {
            const goal = cm.clone().add(this.restPositions[i].clone().applyMatrix3(R));
            this.body0.predicted[i].add(goal.sub(this.body0.predicted[i]).multiplyScalar(this.stiffness * di));
        }
    }

}