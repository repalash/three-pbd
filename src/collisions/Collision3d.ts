import {CollisionContact3d} from "./CollisionContact3d";
import {BaseBody3d} from "../bodies/BaseBody3d";

export abstract class Collision3d{

    abstract findContacts(bodies: BaseBody3d[], contacts: CollisionContact3d[]): void;
}