import { Wall } from './elements/wall';
import * as types from './elements/base-types';
import { ThreeScene } from './three/scene';
import * as THREE from 'three';
import { FloorControls } from './three/floor-controls';

export default class twoDify {
    private floorElements: any = [];
    private activeElement: any;
    private sceneManager: ThreeScene;
    private floorControls: FloorControls;

    constructor(container: HTMLElement) {
        console.log('twoDify constructor');
        this.sceneManager = new ThreeScene(container);
        this.sceneManager.setupThree();
        this.floorControls = new FloorControls(this.sceneManager);
    }

    setupEvents() {
        console.log('setupEvents');
    }

    setActiveElement(type: types.FloorElement) {
        console.log('Active Element - ', type);
        if(type === 'Wall'){
            const wall = new Wall(this.sceneManager).createWall();
            this.floorControls.setActiveElement(wall);
        }
    }

    selectElement(type: types.FloorElement) {
        this.activeElement = type;
        console.log('selectElement', this.activeElement);

        switch (type) {
            case 'Wall':
                const wall = new Wall(this.sceneManager.scene).createWall();
                this.floorElements.push(wall);
                break;
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
            default:
                break;
        }
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
