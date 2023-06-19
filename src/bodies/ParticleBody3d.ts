import {Box3, Matrix4, Vector3} from "three";
import {StaticConstraint3d} from "../constraints/StaticConstraint3d";
import {BaseBody3d} from "./BaseBody3d";

export class ParticleBody3d extends BaseBody3d {
    public position: Vector3 = new Vector3();
    public predict: Vector3 = new Vector3();
    public velocity: Vector3 = new Vector3();

    get positions(): Vector3[] {
        return [this.position];
    }

    get predicted(): Vector3[] {
        return [this.predict];
    }

    get velocities(): Vector3[] {
        return [this.velocity];
    }

    constructor(particle: Vector3, radius: number, mass: number, cloneParticle = false) {
        super(radius, mass);
        this.setParticle(particle, cloneParticle);
    }

    public markAsStatic(bounds?: Box3) {
        if (!bounds || bounds.containsPoint(this.position))
            this.constraints.push(new StaticConstraint3d(this, 0));
    }

    get numParticles(): number {
        return 1;
    }

    get numConstraints(): number {
        return this.constraints.length;
    }

    private setParticle(particle: Vector3, cloneParticle: boolean, RTS?: Matrix4) {
        if(cloneParticle) this.position.copy(particle)
        else this.position = particle;
        if (RTS) this.position.applyMatrix4(RTS)
        this.predict.copy(this.position);
        this.velocity.set(0, 0, 0);

        this.updateBounds();
    }

    get totalMass(): number {
        return this.particleMass;
    }

    get centerOfMass(): Vector3 {
        return this.position;
    }

    get predictedCenterOfMass(): Vector3 {
        return this.predict;
    }

    addToPredicted(vec: Vector3, scale: number = 1) {
        this.predict.addScaledVector(vec, scale);
    }

    updatePositions(){
        return this.updatePosition()
    }

    dispose() {
        super.dispose();
        this.position.set(0, 0, 0);
        this.predict.set(0, 0, 0);
        this.velocity.set(0, 0, 0);
    }

}