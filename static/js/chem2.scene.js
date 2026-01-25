import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById('scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; 

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const loader = new GLTFLoader();
//Loadmodel subprogram 
let mixer;
function loadModel(path, position = {x:0, y:0, z:0}, scale = 1, rotation = {x:0, y:0, z:0}) {
    loader.load(
        path, function(gltf) {
            const model = gltf.scene;
            model.position.set(position.x, position.y, position.z);
            model.scale.set(scale, scale, scale);
            model.rotation.set(rotation.x, rotation.y, rotation.z);
            model.userData.baseRotation = model.rotation.clone();
            scene.add(model);
            //Animaiton learned from https://www.youtube.com/watch?v=zNXQS2DfckU&t=137s
            mixer = new THREE.AnimationMixer(model);
            for(let i=0;i<=10;i++)
            {
                mixer.clipAction(gltf.animations[i]).play();
            }
        },
        undefined, 
        function ( error ) {
                console.error( error );
        }
    );
}

loadModel('/static/models/FractionalColumnV7.glb');

renderer.physicallyCorrectLights = true;
const dirLight = new THREE.DirectionalLight(0xffffff, 10);
dirLight.position.set(5,5,5);
scene.add(dirLight);

scene.add(new THREE.AmbientLight(0xffffff, 10));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);

}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
