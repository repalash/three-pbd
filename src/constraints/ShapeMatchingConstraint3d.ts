// https://github.com/Scrawk/Position-Based-Dynamics/blob/master/Assets/PositionBasedDynamics/Scripts/Constraints/ShapeMatchingConstraint3d.cs
import {Constraint3d} from "./Constraint3d";
import {Matrix3, Vector3} from "three";
import {BaseBody3d} from "../bodies/BaseBody3d";
import {Matrix3Decomposition} from "../math/Matrix3Decomposition";

export class ShapeMatchingConstraint3d extends Constraint3d {

    private invRestMatrix: Matrix3 = new Matrix3().identity();

    private restPositions: Vector3[] = [];

    constructor(body: BaseBody3d, private stiffness: number = 0) {
        super(body);

        let A = this.invRestMatrix;
        const mass = body.particleMass;

        for (let pos of body.positions) {

            let q = pos.clone().sub(body.centerOfMass);

            A.elements[0] += mass * q.x * q.x;
            A.elements[3] += mass * q.x * q.y;
            A.elements[6] += mass * q.x * q.z;

            A.elements[1] += mass * q.y * q.x;
            A.elements[4] += mass * q.y * q.y;
            A.elements[7] += mass * q.y * q.z;

            A.elements[2] += mass * q.z * q.x;
            A.elements[5] += mass * q.z * q.y;
            A.elements[8] += mass * q.z * q.z;

            this.restPositions.push(q);

        }
        A.invert(); // this.invRestMatrix = A

    }

    constrainPositions(di: number) {

        let cm = this.body0.predictedCenterOfMass;
        let mass = this.body0.particleMass;

        const A = new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);

        for (let i = 0; i < this.body0.numParticles; i++) {

            const q = this.restPositions[i];
            const p = this.body0.positions[i].clone().sub(cm);

            A.elements[0] += mass * p.x * q.x;
            A.elements[3] += mass * p.x * q.y;
            A.elements[6] += mass * p.x * q.z;

            A.elements[1] += mass * p.y * q.x;
            A.elements[4] += mass * p.y * q.y;
            A.elements[7] += mass * p.y * q.z;

            A.elements[2] += mass * p.z * q.x;
            A.elements[5] += mass * p.z * q.y;
            A.elements[8] += mass * p.z * q.z;
        }

        A.multiply(this.invRestMatrix);

        // const eps = 1e-6;
        const R = new Matrix3();
        // A.polarDecompositionStable(R, eps); // todo;
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