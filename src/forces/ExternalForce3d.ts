import {BaseBody3d} from "../bodies/BaseBody3d";

export abstract class ExternalForce3d {
    abstract applyForce(dt: number, body: BaseBody3d): void;
}