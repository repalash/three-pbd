import {Box3, Vector3} from "three";
import {Constraint3d} from "../constraints/Constraint3d";
import {StaticConstraint3d} from "../constraints/StaticConstraint3d";

export abstract class BaseBody3d extends EventTarget{
    public damping: number = 1;
    public particleRadius: number;
    public particleMass: number;
    public bounds: Box3 = new Box3();
    public constraints: Constraint3d[] = [];

    abstract positions: Vector3[];
    abstract predicted: Vector3[];
    abstract velocities: Vector3[];

    abstract centerOfMass: Vector3;
    abstract predictedCenterOfMass: Vector3;

    constructor(radius: number, mass: number) {
        super();
        this.particleRadius = radius;
        this.particleMass = mass;

        if (this.particleMass <= 0) {
            throw new Error("Particles mass <= 0");
        }
        if (this.particleRadius <= 0) {
            throw new Error("Particles radius <= 0");
        }
    }

    public constrainPositions(di: number) {
        for (const item of this.constraints.filter(c=>c.isStatic)) item.constrainPositions(di);
        for (const item of this.constraints.filter(c=>!c.isStatic)) item.constrainPositions(di);
    }

    public constrainVelocities() {
        for (const item of this.constraints.filter(c=>c.isStatic)) item.constrainVelocities();
        for (const item of this.constraints.filter(c=>!c.isStatic)) item.constrainVelocities();
    }

    public randomizeConstraintOrder(rnd = Math.random) {
        let count = this.constraints.length;
        if (count <= 1) return;
        let tmp: Constraint3d[] = [];
        while (tmp.length !== count) {
            let i = Math.floor(rnd() * (this.constraints.length - 0.001));
            tmp.push(this.constraints[i]);
            this.constraints.splice(i, 1);
        }
        this.constraints = tmp;
    }

    public markAsStatic(bounds?: Box3) {
        for (let i = 0; i < this.positions.length; i++)
            if (!bounds || bounds.containsPoint(this.positions[i]))
                this.constraints.push(new StaticConstraint3d(this, i));
    }

    public updateBounds(): Box3 {
        let min = new Vector3(Infinity, Infinity, Infinity);
        let max = new Vector3(-Infinity, -Infinity, -Infinity);
        for (const item of this.positions) {
            min.min(item);
            max.max(item);
        }
        min.subScalar(this.particleRadius);
        max.addScalar(this.particleRadius);
        this.bounds = new Box3(min, max);
        return this.bounds;
    }

    get numParticles(): number {
        return this.positions.length;
    }

    get numConstraints(): number {
        return this.constraints.length;
    }

    get totalMass(): number {
        return this.particleMass * this.numParticles;
    }

    addToPredicted(vec: Vector3, scale = 1){
        for (const item of this.predicted) item.addScaledVector(vec, scale);
    }

    onPositionUpdated(delta: number, indexes?: number[]){
        if(Math.abs(delta) <= 0.000001) return 0;
        this.updateBounds();
        this.dispatchEvent(new CustomEvent('positionUpdated', {detail: {delta, indexes}}));
        return delta
    }

    addToPosition(vec: Vector3, scale = 1){
        for (const item of this.positions) item.addScaledVector(vec, scale);
        for (const item of this.predicted) item.addScaledVector(vec, scale);
        this.onPositionUpdated(vec.lengthSq() * scale);
    }

    setPosition(vec: Vector3, i = 0){
        this.positions[i].copy(vec);
        this.predicted[i].copy(vec);
        this.onPositionUpdated(vec.lengthSq() / this.numParticles, [i]);
        return vec;
    }

    setPositions(vec: Vector3[]){
        let d = 0;
        for (let i = 0; i < vec.length; i++){
            d += this.positions[i].sub(vec[i]).lengthSq();
            this.positions[i].copy(vec[i]);
            this.predicted[i].copy(vec[i]);
        }
        this.onPositionUpdated(d / vec.length, vec.map((_, i) => i));
        return vec;
    }

    setVelocity(vec: Vector3, i = 0){
        this.velocities[i].copy(vec);
        return vec;
    }

    setVelocities(vec: Vector3[]){
        for (let i = 0; i < vec.length; i++){
            this.velocities[i].copy(vec[i]);
        }
        return vec;
    }

    updatePosition(i = 0){
        let d = this.positions[i].sub(this.predicted[i]).lengthSq();
        this.positions[i].copy(this.predicted[i]);
        this.onPositionUpdated(d / this.numParticles, [i]);
        return d
    }

    updatePositions(){
        let d = 0;
        const ind = [];
        for (let i = 0; i < this.numParticles; i++) {
            let d1 = this.positions[i].sub(this.predicted[i]).lengthSq();
            if(d1 > 0) {
                this.positions[i].copy(this.predicted[i]);
                ind.push(i);
                d+=d1;
            }
        }
        this.onPositionUpdated(d / ind.length, ind.length === this.numParticles ? undefined : ind);
        return d
    }

    dispose(){
        this.constraints = [];
    }

}