import * as THREE from "three";

/**
 * Every FloorElement which is Wall | Window | Door
 * FloorElement has two main divisions
 * 1. Virtual Mesh - is a Line which is used to control the FloorElement
 * 
 * 2. Real Mesh - is a Mesh which is used to visualize the FloorElement
 *    Real Mesh will be extended in the child classes
 */

export class FloorElement extends THREE.Object3D {
  protected virtualMesh: THREE.LineSegments = new THREE.LineSegments();
  // private realMesh: THREE.Object3D = new THREE.Object3D();

  // private endPoint: THREE.Mesh = new THREE.Mesh();
  // private startPoint: THREE.Mesh = new THREE.Mesh();

  private _length: number = 0;
  private _width: number = 0;
  private _height: number = 0;

  constructor() {
    super();
  }

  get length() {
    return this._length;
  }

  set length(length: number) {
    this._length = length;
    const geometry = this.virtualMesh.geometry as THREE.BufferGeometry;
    const position = geometry.attributes.position as THREE.BufferAttribute;
    position.setXYZ(1, 0, 0, length);
    position.needsUpdate = true;
  }

  get width() {
    return this._width;
  }

  set width(width: number) {
    this._width = width;
  }

  get height() {
    return this._height;
  }

  set height(height: number) {
    this._height = height;
  }


}