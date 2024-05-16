import * as THREE from 'three';
import { AngleLabel } from '../labels/angleLabel';

// Move these to base types
type FloorElement = 'Wall' | 'Door' | 'Window' | 'Chair' | 'Table' | 'Bed' | 'Sofa';

export class FloorHelper{
  private scene: THREE.Scene;
  private helperGroup: THREE.Group = new THREE.Group();
  private helperVector: THREE.Mesh | THREE.Line | undefined;
  private helperEndSphere: THREE.Mesh | undefined;
  private helperAngleLabel: AngleLabel | undefined;
  constructor(scene: THREE.Scene, element: FloorElement, private center: THREE.Vector3) {
    this.scene = scene;
    this.createFloorHelper(element);
  }

  createFloorHelper(element: FloorElement) {
    switch (element) {
      case 'Wall':
        this.createWallHelper();
        break;
      // case 'Door':
      //   this.createDoorHelper();
      //   break;
      // case 'Window':
      //   this.createWindowHelper();
      //   break;
      // case 'Chair':
      //   this.createChairHelper();
      //   break;
      // case 'Table':
      //   this.createTableHelper();
      //   break;
      // case 'Bed':
      //   this.createBedHelper();
      //   break;
      // case 'Sofa':
      //   this.createSofaHelper();
      //   break;
      default:
        break;
    }
  }

  private createWallHelper() {
    this.helperVector = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0x4d4d4d })
    );

    this.helperAngleLabel = new AngleLabel(this.scene);

    this.helperEndSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );

    this.helperGroup.add(this.helperVector);
    this.helperGroup.add(this.helperEndSphere);

    this.scene.add(this.helperGroup);

    this.generateHelperData();
  }
  
  private generateHelperData() {
    if (!this.helperVector ) return;
    const vectorGeometry = new THREE.BufferGeometry();
    vectorGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    this.helperVector.geometry = vectorGeometry;
    const vectorPosition = vectorGeometry.getAttribute('position') as THREE.BufferAttribute;
    vectorPosition.setXYZ(0, this.center.x, 0, this.center.z);
    vectorPosition.setXYZ(1, this.center.x + 10, 0, this.center.z);

    if (!this.helperEndSphere) return;
    const pointX = new THREE.Vector3(vectorPosition.getX(1), vectorPosition.getY(1), vectorPosition.getZ(1));
    this.helperEndSphere.position.copy(pointX);

    if (!this.helperAngleLabel) return;
    this.helperAngleLabel.generateAngle(this.center);
  }
  
  updateHelper(vectorY: THREE.Vector3) {
    if (!this.helperVector) return;

    const vectorGeometry = this.helperVector.geometry as THREE.BufferGeometry;
    const vectorPosition = vectorGeometry.getAttribute('position') as THREE.BufferAttribute;
    const helperVectorEnd = new THREE.Vector3(vectorPosition.getX(1), vectorPosition.getY(1), vectorPosition.getZ(1));

    if (!this.helperAngleLabel) return;
    this.helperAngleLabel.updateAngle(helperVectorEnd, vectorY, this.center);
  }

  removeHelper() {
    this.scene.remove(this.helperGroup);
    if (this.helperAngleLabel) {
      this.helperAngleLabel.removeFromParent();
    }
  }
}