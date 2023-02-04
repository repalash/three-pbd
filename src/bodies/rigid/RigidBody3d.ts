import {Body3d} from "../Body3d";
import {Vector3} from "three";
import {ShapeMatchingConstraint3d} from "../../constraints/ShapeMatchingConstraint3d";

export class RigidBody3d extends Body3d {
    public stiffness: number = 1.0;
    constructor(particles: Vector3[], radius: number, mass: number) {
        super(particles, radius, mass);
        this.constraints.push(new ShapeMatchingConstraint3d(this, mass, this.stiffness));
    }
}