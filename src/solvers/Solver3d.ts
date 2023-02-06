import {ExternalForce3d} from "../forces/ExternalForce3d";
import {Collision3d} from "../collisions/Collision3d";
import {CollisionContact3d} from "../collisions/CollisionContact3d";
import {Constraint3d} from "../constraints/Constraint3d";
import {BaseBody3d} from "../bodies/BaseBody3d";

export class Solver3d {
    solverIterations: number = 3;
    collisionIterations: number = 3;
    sleepThreshold: number = 1e-3;
    bodies: BaseBody3d[] = [];
    forces: ExternalForce3d[] = [];
    collisions: Collision3d[] = [];

    constraints: Constraint3d[] = [];

    addForce(force: ExternalForce3d) {
        if (this.forces.includes(force)) return;
        this.forces.push(force);
    }

    addCollision(collision: Collision3d) {
        if (this.collisions.includes(collision)) return;
        this.collisions.push(collision);
    }

    addConstraint(constraint: Constraint3d) {
        if (this.constraints.includes(constraint)) return;
        this.constraints.push(constraint);
    }

    addBody(body: BaseBody3d) {
        if (this.bodies.includes(body)) return;
        this.bodies.push(body);
    }

    stepPhysics(dt: number) {
        if (dt === 0.0) return;

        this.applyExternalForces(dt);

        this.estimatePositions(dt);

        this.updateBounds();

        this.resolveCollisions();

        this.constrainPositions();

        this.updateVelocities(dt);

        this.constrainVelocities();

        return this.updatePositions();
        // this is done in updatePositions
        // this.updateBounds();
    }

    private applyExternalForces(dt: number) {
        for (const body of this.bodies) {

            for (const velocity of body.velocities) {
                velocity.addScaledVector(velocity, -body.damping * dt);
            }

            for (const force of this.forces) {
                force.applyForce(dt, body);
            }

        }
    }

    private estimatePositions(dt: number) {
        for (const body of this.bodies) {
            for (let i = 0; i < body.numParticles; i++) {
                body.predicted[i].copy(body.positions[i]).addScaledVector(body.velocities[i], dt);
            }
        }
    }

    private updateBounds() {
        for (const body of this.bodies) {
            body.updateBounds();
        }
    }

    private resolveCollisions() {
        const contacts: CollisionContact3d[] = [];

        for (const collision of this.collisions) {
            collision.findContacts(this.bodies, contacts);
        }

        const di = 1.0 / this.collisionIterations;

        for (let i = 0; i < this.collisionIterations; i++) {
            for (const contact of contacts) contact.resolveContact(di);
        }
    }

    private constrainPositions() {
        const di = 1.0 / this.solverIterations;

        for (let i = 0; i < this.solverIterations; i++) {
            for (const constraint of this.constraints) constraint.constrainPositions(di);
            for (const body of this.bodies) body.constrainPositions(di);
        }
    }

    private updateVelocities(dt: number) {
        let invDt = 1.0 / dt;
        let threshold2 = this.sleepThreshold * dt;
        threshold2 *= threshold2;

        for (const body of this.bodies) {
            for (let i = 0; i < body.numParticles; i++) {
                body.velocities[i].subVectors(body.predicted[i], body.positions[i]).multiplyScalar(invDt);
                if(body.velocities[i].lengthSq() < threshold2) {
                    body.velocities[i].set(0,0,0);
                }
            }
        }
    }

    private constrainVelocities() {
        for (const constraint of this.constraints) constraint.constrainVelocities();
        for (const body of this.bodies) body.constrainVelocities();
    }

    private updatePositions() {
        let delta = 0.0;
        for (const body of this.bodies) {
            delta += body.updatePositions();
        }
        return delta;
    }

}