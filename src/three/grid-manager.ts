import * as THREE from 'three';

export class GridManager {
    scene: THREE.Scene;
    grid: THREE.GridHelper;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.grid = new THREE.GridHelper(100, 100);
        this.grid.computeLineDistances();
        this.grid.material = new THREE.LineDashedMaterial({dashSize: 0.015, gapSize: 0.175, vertexColors: true});
        this.scene.add(this.grid);
    }

    // TODO: Create Infinite Grid
}