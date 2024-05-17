import { Wall } from './elements/wall';
import * as types from './elements/base-types';
import { ThreeScene } from './three/scene';
import * as THREE from 'three';
import { IFloorElement } from './elements/base-types';

export default class twoDify {
    private floorElements:IFloorElement[] = [];
    private activeElement: any;
    private sceneManager: ThreeScene;

    constructor(container: HTMLElement) {
        console.log('twoDify constructor');
        this.sceneManager = new ThreeScene(container);
        this.sceneManager.setupThree();
    }

    setupEvents() {
        console.log('setupEvents');
    }

    setActiveElement(type: types.FloorElement) {
        console.log('Active Element - ', type);
        if(type === 'Wall'){
            const wall = new Wall(this.sceneManager, this.floorElements);
            // This needs to be pushed after the editing is done
            wall.onCreated.on((wall) => {
                const floorElement: IFloorElement = {
                    type: wall.type,
                    mesh: wall.mesh,
                    id: wall.id,
                    element: wall
                }
                this.floorElements.push(floorElement);
            });

            // delete later
            // const cube = new THREE.Mesh(
            //     new THREE.BoxGeometry(1, 1, 1),
            //     new THREE.MeshLambertMaterial({ color: 0x00ff00 })
            // );
            // this.sceneManager.scene.add(cube);

            // window.addEventListener('mousemove', (mouseEvent) => {
            //     const x = mouseEvent.offsetX;
            //     const y = mouseEvent.offsetY;
            //     const mouse = new THREE.Vector2();
            //     mouse.x = (x / window.innerWidth) * 2 - 1;
            //     mouse.y = -(y / window.innerHeight) * 2 + 1;
            //     const raycaster = this.sceneManager.raycaster;
            //     raycaster.setFromCamera(mouse, this.sceneManager.camera);
          
            //     const intersects = raycaster.intersectObjects([cube]);
            //     if (!intersects.length) return;
          
            //     // add sphere
            //     const sphere = new THREE.Mesh(
            //       new THREE.SphereGeometry(0.1),
            //       new THREE.MeshBasicMaterial({ color: 0xff0000 })
            //     );
            //     sphere.position.copy(intersects[0].point);
            //     this.sceneManager.scene.add(sphere);
            // });
        }
    }

    // TODO: After creation done, remove the active element and event listeners
    selectElement(type: types.FloorElement) {
        this.activeElement = type;
        console.log('selectElement', this.activeElement);

        switch (type) {
            // case 'Wall':
            //     const wall = new Wall(this.sceneManager.scene).createWall();
            //     this.floorElements.push(wall);
            //     console.log('Wall created');
            //     console.log(wall);
            //     break;
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
