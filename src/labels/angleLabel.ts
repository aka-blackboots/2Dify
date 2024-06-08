import * as THREE from 'three'; 
import { Label } from './label';
import { floorMath } from '../floorMath';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class AngleLabel extends Label{
  private _angleElement: THREE.Line | null = null;
  private rightAngle: THREE.Line | null = null;
  private _currentAngle: number = 0;

  private labelElement: CSS2DObject | null = null;

  get angleElement() {
    return this._angleElement;
  }

  set angleElement(value) {
    this._angleElement = value;
  }

  get currentAngle() {
    return this._currentAngle;
  }

  set currentAngle(value) {
    this._currentAngle = value;
  }

  constructor(scene: THREE.Scene) {
    super(scene);
  }

  generateAngle(center: THREE.Vector3) {
    if (this.angleElement) return;
    
    const curve = new THREE.EllipseCurve(
      center.x,  center.z,
      1, 1,
      2,  2 * Math.PI,
      false,
      0
    );
    const points = curve.getPoints( 50 );
    const geometry22 = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    const ellipse = new THREE.Line( geometry22, material );
    ellipse.rotateX(Math.PI / 2);
    // TODO: How to manage this intuitively?
    ellipse.visible = false;
    this.angleElement = ellipse;
    this.scene.add(this.angleElement);

    this.labelElement = this.createLabel('0°');
  }

  updateAngle(v1: THREE.Vector3, v2: THREE.Vector3, center: THREE.Vector3) {
    if (!this.angleElement) return;
    this.angleElement.visible = true;
    
    if (this.rightAngle) {
      this.rightAngle.removeFromParent();
      this.rightAngle = null;
    }

    const angle = this.getAngle(v1, v2, center);
    this.currentAngle = angle;

    if (v2.z > center.z ) {
      // Clockwise
      const angleInDeg = (THREE.MathUtils.radToDeg(angle)).toFixed(2);

      if (this.labelElement) {
        this.labelElement.element.textContent = `${angleInDeg}°`;
        this.labelElement.position.set(center.x + 1, 0, center.z + 1);
      }

      if (angleInDeg === '90.00') {
          this.angleElement.visible = false;
          this.createRightAngle(center, true);
      } else {
          const elip = this.angleElement as THREE.Line;
          const curve = new THREE.EllipseCurve(
            center.x, center.z,
            1, 1,
            angle, 2 * Math.PI,
            true,
            0
          );
          const points = curve.getPoints( 50 );
          const geometry = new THREE.BufferGeometry().setFromPoints( points );
          elip.geometry = geometry;
      }
    } else {
      // Anti-clockwise
      const angleInDeg = (THREE.MathUtils.radToDeg(angle)).toFixed(2);

      if (this.labelElement) {
        this.labelElement.element.textContent = `${angleInDeg}°`;
        this.labelElement.position.set(center.x - 1, 0, center.z - 1);
      }

      if (angleInDeg === '90.00') {
        this.angleElement.visible = false;
        this.createRightAngle(center, false);
      } else {
        const elip = this.angleElement as THREE.Line;
        const curve = new THREE.EllipseCurve(
          center.x, center.z,
          1, 1,
          -angle, 2 * Math.PI,
          false,
          0
        );
        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        elip.geometry = geometry;
      }
    }
  }

  private createRightAngle(center: THREE.Vector3, clockwise = true) {
    let zFactor = 0;
    if (clockwise) {
      zFactor = 1;
    } else {
      zFactor = -1;
    }
    console.log(`Z Factor: ${zFactor}`)
    const points = [
      new THREE.Vector3(center.x, center.y, center.z + zFactor),
      new THREE.Vector3(center.x + 1, center.y, center.z + zFactor),
      new THREE.Vector3(center.x + 1, center.y, center.z)
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    this.rightAngle = line;
  }

  private getAngle(v1: THREE.Vector3, v2: THREE.Vector3, center: THREE.Vector3) {
    const angle = floorMath.angleBetween(v1, v2, center);
    return angle;
  }

  removeFromParent() {
    if (this.angleElement) {
      this.scene.remove(this.angleElement);
      this.angleElement = null;
    }
    if (this.rightAngle) {
      this.scene.remove(this.rightAngle);
      this.rightAngle = null;
    }
  }
  
}