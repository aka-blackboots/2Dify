import { Wall } from './elements/wall';
import * as types from './elements/base-types';
import { ThreeScene } from './three/scene';
import * as THREE from 'three';
import { IFloorElement } from './elements/base-types';
import { Snapper } from './primitives/snapper';
export * from './labels/label';

export class twoDify {
    private floorElements:IFloorElement[] = [];
    private activeElement: any;
    private sceneManager: ThreeScene;
    snapper: Snapper;

    constructor(container: HTMLElement) {
        console.log('twoDify constructor');
        this.sceneManager = new ThreeScene(container);
        this.sceneManager.setupThree();

        // // draw line
        // const points = [];
        // points.push(new THREE.Vector3(-10, 0, 0));
        // points.push(new THREE.Vector3(0, 10, 0));
        // points.push(new THREE.Vector3(10, 0, 0));

        // const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // const material = new THREE.LineBasicMaterial({color: 0x0000ff});
        // const line = new THREE.Line(geometry, material);
        // this.sceneManager.scene.add(line);
        // this.floorElements.push({
        //     type: 'Wall',
        //     mesh: line,
        //     id: '1'
        // });

        this.snapper = new Snapper(
            container, 
            this.sceneManager, 
            this.sceneManager.camera?.camera!, 
            this.floorElements
        );
    }

    setupEvents() {
        console.log('setupEvents');
    }

    setActiveElement(type: types.FloorElement) {
        console.log('Active Element - ', type);
        if(type === 'Wall'){
            const wall = new Wall(this.sceneManager, this.floorElements);
            this.snapper.onSnapperMove.on((point) => {
                wall.onPointerMove(point?.point!);
            });

            this.snapper.onSnapperDown.on((point) => {
                wall.onPointerDown(point?.point!);
            });

            wall.onCreated.on((wall) => {
                const floorElement: IFloorElement = {
                    type: wall.type,
                    mesh: wall.mesh,
                    id: wall.id,
                    element: wall,
                    virtualMesh: wall.wallMesh,
                }
                this.floorElements.push(floorElement);

                // TODO: or maybe a RESET method on snapper
                // this.snapper.reset();
                this.snapper.onSnapperMove.dispose();
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

    get dotGrid() {
        if (!this.sceneManager.gridManager) return;
        return this.sceneManager.gridManager.grid;
    }
}

export * from './constants';
