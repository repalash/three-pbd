import {Collision3d} from "./Collision3d";
import {Vector3} from "three";
import {CollisionContact3d} from "./CollisionContact3d";
import {BodyPlaneContact3d} from "./BodyPlaneContact3d";
import {BaseBody3d} from "../bodies/BaseBody3d";
export class PlanarCollision3d extends Collision3d {
    private readonly normal: Vector3;
    private readonly distance: number;

    constructor(normal: Vector3, distance: number) {
        super();
        this.normal = normal.clone().normalize();
        this.distance = distance;
    }

    public findContacts(bodies: BaseBody3d[], contacts: CollisionContact3d[]): void {
        for (const body of bodies) {
            const numParticles = body.numParticles;
            const radius = body.particleRadius;

            for (let i = 0; i < numParticles; i++) {
                const d = this.normal.dot(body.predicted[i]) + this.distance - radius;

                if (d < 0.0) {
                    contacts.push(new BodyPlaneContact3d(body, i, this.normal, this.distance));
                }
            }
        }
    }

}