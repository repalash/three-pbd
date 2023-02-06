import {BaseBody3d} from "../bodies/BaseBody3d";
import {BaseDistanceConstraint3d} from "./BaseDistanceConstraint3d";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {Line2} from "three/examples/jsm/lines/Line2";

export class BodyDistanceConstraint3d extends BaseDistanceConstraint3d {
    constructor(public readonly body0: BaseBody3d, public readonly body1: BaseBody3d, stiffness: number) {
        super(stiffness, stiffness);
        this.restLength = body0.predictedCenterOfMass.distanceTo(body1.predictedCenterOfMass);
    }

    public constrainPositions(di: number): void {
        const mass0 = this.body0.totalMass;
        const mass1 = this.body1.totalMass;
        const c0 = this.body0.predictedCenterOfMass;
        const c1 = this.body1.predictedCenterOfMass;

        let corr = this.getCorrection(c0, c1).multiplyScalar(di * (mass0 + mass1));

        this.body0.addToPredicted(corr, 1.0 / mass0);
        this.body1.addToPredicted(corr, -1.0 / mass1);
    }

    makeObject(){
        const geom = new LineGeometry();
        const c0 = this.body0.predictedCenterOfMass;
        const c1 = this.body1.predictedCenterOfMass;
        geom.setPositions([c0.x, c0.y, c0.z, c1.x, c1.y, c1.z])
        geom.setColors([1, 0, 0, 0, 1, 0]);

        const mat = new LineMaterial( {
            color: 0xffffff,
            linewidth: 2, // in world units with size attenuation, pixels otherwise
            vertexColors: true,
            //resolution:  // to be set by renderer, eventually
            dashed: false,
            alphaToCoverage: true,
        } );
        const line = new Line2(geom, mat);
        line.computeLineDistances();

        return line;
    }
}