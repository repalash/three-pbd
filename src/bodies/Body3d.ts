import {Box3, Matrix4, Vector3} from "three";
import {BaseBody3d} from "./BaseBody3d";

export class Body3d extends BaseBody3d{
    public positions: Vector3[] = [];
    public predicted: Vector3[] = [];
    public velocities: Vector3[] = [];

    private _centerOfMass: Vector3 = new Vector3();

    constructor(particles: Vector3[], radius: number, mass: number, cloneParticle = false) {
        super(radius, mass);
        this.setParticles(particles, cloneParticle);
    }

    public randomizePositions(rnd = Math.random, amount: number) {
        for (let i = 0; i < this.numParticles; i++) {
            let rx = rnd() * 2.0 - 1.0;
            let ry = rnd() * 2.0 - 1.0;
            let rz = rnd() * 2.0 - 1.0;
            this.positions[i].x += rx * amount;
            this.positions[i].y += ry * amount;
            this.positions[i].z += rz * amount;
        }
    }

    private setParticles(particles: Vector3[], cloneParticle: boolean, RTS?: Matrix4) {
        this.positions = [];
        this.predicted = [];
        this.velocities = [];

        for (const item of particles) {
            const p = cloneParticle ? item.clone() : item;
            if(RTS) p.applyMatrix4(RTS)
            this.positions.push(p)
            this.predicted.push(p.clone());
            this.velocities.push(new Vector3());
        }

        this.updateBounds();
    }

    updateBounds(): Box3 {
        const b = super.updateBounds();
        this._centerOfMass.set(0, 0, 0);
        this.positions.reduce((a, b) => a.add(b), this._centerOfMass).divideScalar(this.numParticles);
        return b;
    }

    get centerOfMass(): Vector3 {
        return this._centerOfMass;
    }

    get predictedCenterOfMass(): Vector3 {
        return this.predicted.reduce((a, b) => a.add(b), new Vector3()).divideScalar(this.numParticles);
    }

}
