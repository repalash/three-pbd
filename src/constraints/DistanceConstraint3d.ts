import {BaseBody3d} from "../bodies/BaseBody3d";
import {BaseDistanceConstraint3d} from "./BaseDistanceConstraint3d";
import {BufferGeometry, Float32BufferAttribute, Line, MeshBasicMaterial} from "three";

export class DistanceConstraint3d extends BaseDistanceConstraint3d {
    private readonly i0: number;
    private readonly i1: number;

    constructor(public readonly body0: BaseBody3d, i0: number, i1: number, stiffness: number) {
        super(stiffness, stiffness);
        this.i0 = i0;
        this.i1 = i1;
        this.restLength = body0.predicted[i0].distanceTo(body0.predicted[i1]);
    }

    public constrainPositions(di: number): void {
        let corr = this.getCorrection(this.body0.predicted[this.i0], this.body0.predicted[this.i1]);
        corr.multiplyScalar(di)

        this.body0.predicted[this.i0].add(corr);
        this.body0.predicted[this.i1].sub(corr);
    }

    // get p1() {
    //     return this.body0.predicted[this.i0];
    // }
    // get p2() {
    //     return this.body0.predicted[this.i1];
    // }

    makeObject(){
        const geom = new BufferGeometry();
        const c0 = this.body0.predicted[this.i0];
        const c1 = this.body0.predicted[this.i1];
        geom.setFromPoints([c0, c1])
        geom.setAttribute('color', new Float32BufferAttribute([1, 0, 0, 0, 1, 0], 3));
        const line = new Line(geom, new MeshBasicMaterial({vertexColors: true, color: 0xffffff}));

        this.body0.addEventListener('positionUpdated', (evt: any)=>{
            if(!evt.detail.indexes || evt.detail.indexes.includes(this.i0) || evt.detail.indexes.includes(this.i1)){
                const _c0 = this.body0.predicted[this.i0];
                const _c1 = this.body0.predicted[this.i1];
                geom.setFromPoints([_c0, _c1])
            }
        })

        return line;
    }
}
