import {BufferGeometry} from "three";
import {ShapeMatchingConstraint3d} from "../../constraints/ShapeMatchingConstraint3d";
import {GeometryBody3d} from "../GeometryBody3d";

export class RigidGeometryBody3d extends GeometryBody3d {
    constructor(geometry: BufferGeometry, radius: number, mass: number, stiffness: number = 1) {
        super(geometry, radius, mass);
        this.constraints.push(new ShapeMatchingConstraint3d(this, stiffness));
    }

}