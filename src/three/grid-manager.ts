import * as THREE from 'three';

export class GridManager {
    scene: THREE.Scene;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
        const grid = new THREE.GridHelper(100, 100);
        grid.computeLineDistances();
        grid.material = new THREE.LineDashedMaterial({dashSize: 0.02, gapSize: 0.1, vertexColors: true});
        this.scene.add(grid);
    }

    // TODO: Create Infinite Grid
}