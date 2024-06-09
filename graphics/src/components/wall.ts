import { FloorElement } from './floor-element';
import * as THREE from 'three';

export class Wall extends FloorElement {
  _color: THREE.Color = new THREE.Color(0xC2A282);
  _opacity: number = 0.7;
  _borderColor: THREE.Color = new THREE.Color(0x000000);
  _skeletonColor: THREE.Color = new THREE.Color(0x8B8B8B);

  set color(color: THREE.Color) {
    this._color = color;
  }

  get color() {
    return this._color;
  }

  set opacity(opacity: number) {
    this._opacity = opacity;
  }

  get opacity() {
    return this._opacity;
  }

  set borderColor(borderColor: THREE.Color) {
    this._borderColor = borderColor;
  }

  get borderColor() {
    return this._borderColor;
  }

  set skeletonColor(skeletonColor: THREE.Color) {
    this._skeletonColor = skeletonColor;
    this.virtualMesh.material = new THREE.LineBasicMaterial({ color: this._skeletonColor });
  }

  get skeletonColor() {
    return this._skeletonColor;
  }

  constructor() {
    super();
    this._createWall();
  }

  private _createWall() {
    this._createWallSkeleton();
  }

  private _createWallSkeleton() {
    const virtualWallGeometry = new THREE.BufferGeometry();
    virtualWallGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 2]), 3));
    this.virtualMesh = new THREE.LineSegments(
      virtualWallGeometry,
      new THREE.LineBasicMaterial({ color: this._skeletonColor })
    );
    this.add(this.virtualMesh);
  }
}