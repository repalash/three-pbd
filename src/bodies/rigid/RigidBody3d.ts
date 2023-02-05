import {Body3d} from "../Body3d";
import {Vector3} from "three";
import {ShapeMatchingConstraint3d} from "../../constraints/ShapeMatchingConstraint3d";

export class RigidBody3d extends Body3d {
    constructor(particles: Vector3[], radius: number, mass: number, stiffness: number = 1.0) {
        super(particles, radius, mass);
        this.constraints.push(new ShapeMatchingConstraint3d(this, stiffness));
    }
}