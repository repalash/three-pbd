import {Vector3} from "three";
import {ExternalForce3d} from "./ExternalForce3d";
import {BaseBody3d} from "../bodies/BaseBody3d";

export class GravitationalForce3d extends ExternalForce3d {
    constructor(public gravity = new Vector3(0, -9.81, 0)) {
        super();
    }

    applyForce(dt: number, body: BaseBody3d): void {
        for (const velocity of body.velocities) {
            velocity.addScaledVector(this.gravity, dt);
        }
    }
}