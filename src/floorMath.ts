import * as THREE from 'three';

export const floorMath = {
  sub: (v1: THREE.Vector3, v2: THREE.Vector3) => {
    const sub = new THREE.Vector3();
    sub.x = v1.x - v2.x;
    sub.y = v1.y - v2.y;
    sub.z = v1.z - v2.z;
    return sub;
  },
  magnitude: (v1: THREE.Vector3) => {
    const mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
    return mag;
  },
  dot: (v1: THREE.Vector3, v2: THREE.Vector3) => {
    const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    return dot;
  },
  angleBetween: (v1: THREE.Vector3, v2: THREE.Vector3, center = new THREE.Vector3()) => {
    const v1C1 = floorMath.sub(v1, center);
    const v2C1 = floorMath.sub(v2, center);
    const v1V2 = floorMath.dot(v1C1, v2C1);
    const magV1 = floorMath.magnitude(v1C1);
    const magV2 = floorMath.magnitude(v2C1);
    const angle = Math.acos(v1V2 / (magV1 * magV2));
    return angle;
  },
 }
