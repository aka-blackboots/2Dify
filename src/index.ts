// import { Wall } from './elements/wall';
import * as types from './elements/base-types';
import { ThreeScene } from './three/scene';
import * as THREE from 'three';

export default class twoDify {
    // private floorElements: any;
    private activeElement: any;
    private sceneManager: ThreeScene;

    constructor(container: HTMLElement) {
        console.log('twoDify constructor');
        this.sceneManager = new ThreeScene(container);
        this.sceneManager.setupThree();
        this.setupEvents();
    }

    setupEvents() {
        console.log('setupEvents');
    }

    selectElement(type: types.FloorElement) {
        this.activeElement = type;
        console.log('selectElement', this.activeElement);
        // switch (type) {
        //     case types.FloorElement.Wall:
        //         this.createSimpleWall();
        //         break;
            // case types.FloorElement.Door:
            //     this.createSimpleDoor();
            //     break;
            // case types.FloorElement.Window:
            //     this.createSimpleWindow();
            //     break;
            // case types.FloorElement.Chair:
            //     this.createSimpleChair();
            //     break;
            // case types.FloorElement.Table:
            //     this.createSimpleTable();
            //     break;
            // case types.FloorElement.Bed:
            //     this.createSimpleBed();
            //     break;
            // case types.FloorElement.Sofa:
            //     this.createSimpleSofa();
            //     break;
        //     default:
        //         break;
        // }
    }

    // createSimpleWall() {
    //     const wall = new Wall();
    // }

    createDebugCube() {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        );
        this.sceneManager.scene.add(cube);
    }
}

export * from './constants';
