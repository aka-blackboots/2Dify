// main.js
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    DirectionalLight,
    AmbientLight,
    MeshStandardMaterial,
    Vector3,
} from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import { twoDify} from "../dist/twoDify.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from 'dat.gui';

const gui = new GUI();

const guiControls = {
    lineColor: '#ff0000',
    backgroundColor: '#ffffff',
    lod: 2,
};

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

async function init() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    camera.position.z = 6;
    camera.position.y = 20;
    camera.position.x = -10;

    const threeCanvas = document.getElementById("three-canvas");
    const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf1faee);

    const geometry = new BoxGeometry();
    const material = new MeshStandardMaterial({ color: 0x00ff00 });
    const cube1 = new Mesh(geometry, material);
    cube1.position.x = -30
    scene.add(cube1);

    const cube2 = new Mesh(geometry, material);
    cube2.position.x = 50;
    cube2.position.y = 10
    scene.add(cube2);

    // 2Dify Code
    const twoDifyInstance = new twoDify(scene, camera);
    twoDifyInstance.updateLOD(guiControls.lod);

    twoDifyInstance.createNewView(document.getElementById("container2"), 'front');

    twoDifyInstance.createNewView(document.getElementById("my-2d-map"), 'top');

    twoDifyInstance.setLineColor(guiControls.lineColor);
    twoDifyInstance.setBackgroundColor(guiControls.backgroundColor);

    const loader = new GLTFLoader();
    await loader.load('../resources/lowpoly_football_field_and_a_supermarket.glb', (gltf) => {
        scene.add(gltf.scene);
        twoDifyInstance.moveTheCameraToFit();
    });

    twoDifyInstance.addMarker({x: 9, y: 0, z: 7}, "⚽");
    twoDifyInstance.addMarker({x: 20, y: 0, z: -15}, "🍲");

    //Creates the lights of the scene
    const lightColor = 0xFDB813;

    const ambientLight = new AmbientLight(lightColor, 1);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(lightColor, 1);
    directionalLight.position.set(-5, 10, 3);
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    const controls = new OrbitControls(camera, threeCanvas);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    const handleResize = () => {
        (size.width = window.innerWidth), (size.height = window.innerHeight);
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
    };

    addWASDControls(controls, camera)

    window.addEventListener('resize', handleResize);

    const animate = () => {
        requestAnimationFrame(animate);

        // Render the scene
        renderer.render(scene, camera);
        controls.update();

        twoDifyInstance.startRendering(controls);
    };

    // Start the animation
    animate();


    const dify = gui.addFolder('2Dify');
    dify.open();
    dify.addColor(guiControls, 'lineColor').onChange((color) => {
        twoDifyInstance.setLineColor(color);
    });

    dify.addColor(guiControls, 'backgroundColor').onChange((color) => {
        twoDifyInstance.setBackgroundColor(color);
    });
    // add dropdown for LOD control
    dify.add(guiControls, 'lod', [1, 2, 3, 4, 5]).onChange((value) => {
        twoDifyInstance.updateLOD(value);
    });
}


init();

// add dat.gui to edit line color and background color



function addWASDControls(orbitControls, camera, speed = 1) {
    document.addEventListener('keydown', function(event) {
        const right = new Vector3().crossVectors(
            camera.up, camera.getWorldDirection(new Vector3()).negate()).normalize();

        switch(event.key) {
            case 'w': // forward
                camera.position.x += speed * camera.getWorldDirection(new Vector3()).x;
                camera.position.z += speed * camera.getWorldDirection(new Vector3()).z;
                break;
            case 'a': // left
                camera.position.addScaledVector(right, -speed)
                break;
            case 's': // back
                camera.position.x -= speed * camera.getWorldDirection(new Vector3()).x;
                camera.position.z -= speed * camera.getWorldDirection(new Vector3()).z;
                break;
            case 'd': // right
                camera.position.addScaledVector(right, speed)
                break;
        }

        orbitControls.update();
    });
}
