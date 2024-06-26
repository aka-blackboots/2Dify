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
    label.style.width = 'fit-to-content';
    label.style.height = 'fit-to-content';
    label.innerHTML = text;
    label.style.top = '0';
    label.style.left = '0';
    label.style.color = 'white';
    label.style.backgroundColor = '#1E6FD9';
    label.style.opacity = '0.7';
    label.style.fontSize = '11px';
    label.style.padding = '2px 6px';
    label.style.borderRadius = '24px';
    label.style.fontFamily = 'Arial, sans-serif';
    label.style.border = 'unset';

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