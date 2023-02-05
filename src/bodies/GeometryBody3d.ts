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
    constructor(geometry: BufferGeometry, radius: number, mass: number){
        super(getVertices(geometry), radius, mass);
        this.addEventListener('positionUpdated', (evt) => {
            const indexes = (evt as any).detail.indexes ?? this.positions.map((_, i) => i);
            const arr = (geometry.attributes.position as BufferAttribute);
            for (const index of indexes) {
                const pos = this.positions[index];
                arr.setXYZ(index, pos.x, pos.y, pos.z);
            }
            arr.needsUpdate = true;
        });
    }

}
