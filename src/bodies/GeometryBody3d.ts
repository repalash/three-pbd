import {BufferAttribute, BufferGeometry, Vector3} from "three";
import {Body3d} from "./Body3d";

function getVertices(geometry: BufferGeometry): Vector3[]{
    const arr = (geometry.attributes.position as BufferAttribute).array;
    const vertices = [];
    for (let i = 0; i < arr.length; i += 3) {
        vertices.push(new Vector3(arr[i], arr[i + 1], arr[i + 2]));
    }
    return vertices;
}
export class GeometryBody3d extends Body3d{
    constructor(public readonly geometry: BufferGeometry, radius: number, mass: number){
        super(getVertices(geometry), radius, mass);
        this.addEventListener('solveEnd', (_) => {
            const indexes = this._updatedIndexes;
            const arr = (geometry.attributes.position as BufferAttribute);
            if(indexes) {
                for (const i of indexes) {
                    const pos = this.positions[i];
                    arr.setXYZ(i, pos.x, pos.y, pos.z);
                }
            }else{
                const l = this.positions.length;
                for (let i = 0; i < l; i++) {
                    const pos = this.positions[i];
                    arr.setXYZ(i, pos.x, pos.y, pos.z);
                }
            }
            arr.needsUpdate = true;
        });
    }

}
