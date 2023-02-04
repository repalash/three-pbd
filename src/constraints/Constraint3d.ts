import {BaseBody3d} from "../bodies/BaseBody3d";

export abstract class Constraint3d {
    protected constructor(protected readonly body0: BaseBody3d) {
    }

    public constrainPositions(_: number): void {};

    public constrainVelocities(): void {};

}
export abstract class BodyConstraint3d extends Constraint3d{
    protected constructor(
        body0: BaseBody3d,
        protected readonly body1: BaseBody3d
    ) {
        super(body0);
    }

}