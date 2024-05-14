import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

type ILabelStore = {
  [key: string]: {
    label: CSS2DObject;
    type: string;
  };
};

export class Label{
  protected scene: THREE.Scene;
  private label: ILabelStore = {};
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  createLabel(text: string, type='generic') {
    // css3 label
    const label = document.createElement('div');
    label.className = 'label';
    label.style.position = 'absolute';
    label.style.width = '100px';
    label.style.height = '100px';
    label.innerHTML = text;
    label.style.top = '0';
    label.style.left = '0';
    label.style.color = 'white';
    label.style.backgroundColor = 'black';

    const labelObject = new CSS2DObject(label);
    labelObject.position.set(0, 0, 0);
    this.scene.add(labelObject);

    this.label[text] = {
      label: labelObject,
      type: type
    };

    return labelObject;
  }

  updateLabelPosition(text: string, position: THREE.Vector3) {
    if (this.label[text]) {
      this.label[text].label.position.copy(position);
    }
  }
}