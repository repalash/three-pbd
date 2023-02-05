import {Matrix3, Vector3} from "three";

export class Matrix3Decomposition{

    /**
     * Rotates A through phi in pq-plane to set A(p,q) = 0
     * Rotation stored in R whose columns are eigenvectors of A
     * @param A
     * @param R
     * @param p
     * @param q
     * @constructor
     */
    static JacobiRotate(A: Matrix3, R: Matrix3, p: number, q: number) {

        if (A.elements[q * 3 + p] === 0) {
            return;
        }

        let d = (A.elements[p * 3 + p] - A.elements[q * 3 + q]) / (2 * A.elements[q * 3 + p]);
        let t = 1 / (Math.abs(d) + Math.sqrt(d * d + 1));
        if (d < 0) t = -t;
        let c = 1 / Math.sqrt(t * t + 1);
        let s = t * c;

        A.elements[p * 3 + p] += t * A.elements[q * 3 + p];
        A.elements[q * 3 + q] -= t * A.elements[q * 3 + p];
        A.elements[q * 3 + p] = A.elements[p * 3 + q] = 0;

        // transform A
        for (let k = 0; k < 3; k++) {
            if (k !== p && k !== q) {
                let Akp = c * A.elements[p * 3 + k] + s * A.elements[q * 3 + k];
                let Akq = -s * A.elements[p * 3 + k] + c * A.elements[q * 3 + k];
                A.elements[p * 3 + k] = A.elements[k * 3 + p] = Akp;
                A.elements[q * 3 + k] = A.elements[k * 3 + q] = Akq;
            }
        }

        // store rotation in R
        for (let k = 0; k < 3; k++) {
            let Rkp = c * R.elements[p * 3 + k] + s * R.elements[q * 3 + k];
            let Rkq = -s * R.elements[p * 3 + k] + c * R.elements[q * 3 + k];
            R.elements[p * 3 + k] = Rkp;
            R.elements[q * 3 + k] = Rkq;
        }

    }

    static EigenDecomposition(A: Matrix3, eigenVecs: Matrix3, eigenVals: Vector3) {
        const numJacobiIterations = 10;
        const epsilon = 1e-15;

        let D = A.clone();

        // only for symmetric matrices!
        eigenVecs.identity();    // unit matrix
        let iter = 0;

        while (iter < numJacobiIterations) {
            // 3 off diagonal elements
            // find off diagonal element with maximum modulus
            let p, q;
            let a, max;
            max = Math.abs(D.elements[3]);
            p = 0;
            q = 1;
            a = Math.abs(D.elements[6]);
            if (a > max) {
                p = 0;
                q = 2;
                max = a;
            }
            a = Math.abs(D.elements[7]);
            if (a > max) {
                p = 1;
                q = 2;
                max = a;
            }
            // all small enough -> done
            if (max < epsilon) break;
            // rotate matrix with respect to that element
            this.JacobiRotate(D, eigenVecs, q, p);
            iter++;

        }

        eigenVals.set(D.elements[0], D.elements[4], D.elements[8]);
    }

    public static PolarDecomposition(A: Matrix3, R: Matrix3, U: Matrix3, D: Matrix3) {
        // A = SR, where S is symmetric and R is orthonormal
        // -> S = (A A^T)^(1/2)

        // A = U D U^T R

        let AAT = new Matrix3();
        AAT.elements[0] = A.elements[0] * A.elements[0] + A.elements[3] * A.elements[3] + A.elements[6] * A.elements[6];
        AAT.elements[4] = A.elements[1] * A.elements[1] + A.elements[4] * A.elements[4] + A.elements[7] * A.elements[7];
        AAT.elements[8] = A.elements[2] * A.elements[2] + A.elements[5] * A.elements[5] + A.elements[8] * A.elements[8];

        AAT.elements[3] = A.elements[0] * A.elements[1] + A.elements[3] * A.elements[4] + A.elements[6] * A.elements[7];
        AAT.elements[6] = A.elements[0] * A.elements[2] + A.elements[3] * A.elements[5] + A.elements[6] * A.elements[8];
        AAT.elements[7] = A.elements[1] * A.elements[2] + A.elements[4] * A.elements[5] + A.elements[7] * A.elements[8];

        AAT.elements[1] = AAT.elements[3];
        AAT.elements[2] = AAT.elements[6];
        AAT.elements[5] = AAT.elements[7];

        R.identity();
        let eigenVals = new Vector3();
        this.EigenDecomposition(AAT, U, eigenVals);

        let d0 = Math.sqrt(eigenVals.x);
        let d1 = Math.sqrt(eigenVals.y);
        let d2 = Math.sqrt(eigenVals.z);

        D.identity();
        D.elements[0] = d0;
        D.elements[4] = d1;
        D.elements[8] = d2;

        const eps = 1e-15;

        let l0 = eigenVals.x; if (l0 <= eps) l0 = 0.0; else l0 = 1.0 / d0;
        let l1 = eigenVals.y; if (l1 <= eps) l1 = 0.0; else l1 = 1.0 / d1;
        let l2 = eigenVals.z; if (l2 <= eps) l2 = 0.0; else l2 = 1.0 / d2;

        R.elements[0] = l0 * U.elements[0] * U.elements[0] + l1 * U.elements[3] * U.elements[3] + l2 * U.elements[6] * U.elements[6];
        R.elements[4] = l0 * U.elements[1] * U.elements[1] + l1 * U.elements[4] * U.elements[4] + l2 * U.elements[7] * U.elements[7];
        R.elements[8] = l0 * U.elements[2] * U.elements[2] + l1 * U.elements[5] * U.elements[5] + l2 * U.elements[8] * U.elements[8];

        R.elements[3] = l0 * U.elements[0] * U.elements[1] + l1 * U.elements[3] * U.elements[4] + l2 * U.elements[6] * U.elements[7];
        R.elements[6] = l0 * U.elements[0] * U.elements[2] + l1 * U.elements[3] * U.elements[5] + l2 * U.elements[6] * U.elements[8];
        R.elements[7] = l0 * U.elements[1] * U.elements[2] + l1 * U.elements[4] * U.elements[5] + l2 * U.elements[7] * U.elements[8];

        R.elements[1] = R.elements[3];
        R.elements[2] = R.elements[6];
        R.elements[5] = R.elements[7];

        R.multiply(A);

        // stabilize
        let c0 = new Vector3(R.elements[0], R.elements[1], R.elements[2]);
        let c1 = new Vector3(R.elements[3], R.elements[4], R.elements[5]);
        let c2 = new Vector3(R.elements[6], R.elements[7], R.elements[8]);

        if(c0.lengthSq() < eps)
            c0.crossVectors(c1, c2);
        else if(c1.lengthSq() < eps)
            c1.crossVectors(c2, c0);
        else
            c2.crossVectors(c0, c1);

        R.set(
            c0.x, c1.x, c2.x,
            c0.y, c1.y, c2.y,
            c0.z, c1.z, c2.z
        )
    }

    // https://github.com/Scrawk/Position-Based-Dynamics/blob/85dc18c31584d0fffb42ab197d3ee78b8456f3d2/Assets/Common/LinearAlgebra/Matrix3x3dDecomposition.cs#L161
}