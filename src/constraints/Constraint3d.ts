export abstract class Constraint3d {
    readonly isStatic: boolean = false;

    protected constructor() {
    }


    public constrainPositions(_: number): void {};

    public constrainVelocities(): void {};

}