import * as THREE from 'three';

export const floorMath = {
    magnitude: (v1: THREE.Vector3) => {
      const mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
      return mag;
    },
    angleBetween: (v1: THREE.Vector3, v2: THREE.Vector3) => {
      const magV1 = floorMath.magnitude(v1);
      const magV2 = floorMath.magnitude(v2);
      const denominator = magV1 * magV2;
      return denominator;
    },
}
