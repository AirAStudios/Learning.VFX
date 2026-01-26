import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const canvas = document.getElementById('scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; 

const HDRloader = new RGBELoader();
const envMap = await HDRloader.loadAsync( '/static/textures/HDR1.hdr');
envMap.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = envMap;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.environmentIntensity = 1;

const GLTFloader = new GLTFLoader();
//Loadmodel subprogram 
let mixer1;
let mixer2;
function loadModel(path, frames = 0, mixer_num, position = {x:0, y:0, z:0}, scale = 1, rotation = {x:0, y:0, z:0}) {
    GLTFloader.load(
        path, function(gltf) {
            const model = gltf.scene;
            model.position.set(position.x, position.y, position.z);
            model.scale.set(scale, scale, scale);
            model.rotation.set(rotation.x, rotation.y, rotation.z);
            model.userData.baseRotation = model.rotation.clone();
            scene.add(model);
            if (frames != 0)
            {
                //Animaiton learned from https://www.youtube.com/watch?v=zNXQS2DfckU&t=137s
                if (mixer_num == 1) {
                    mixer1 = new THREE.AnimationMixer(model);
                    for(let i=0;i<=(frames-1);i++)
                    {
                        mixer1.clipAction(gltf.animations[i]).play();
                    }
                }
                else {
                    mixer2 = new THREE.AnimationMixer(model);
                    for(let i=0;i<=(frames-1);i++)
                    {
                        mixer2.clipAction(gltf.animations[i]).play();
                    }
                }

            }
        },
        undefined, 
        function ( error ) {
                console.error( error );
        }
    );
}

loadModel('/static/models/LettersV1.glb');
loadModel('/static/models/FractionalColumnV2.glb', 12, 1)
loadModel('/static/models/ParticlesV1.glb', 4850, 2);
loadModel('/static/models/ArrowGlowV2.glb');

//Lighting
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5,5,5);
scene.add(dirLight);

scene.add(new THREE.AmbientLight(0xffffff, 1));  

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    if (mixer1) mixer1.update(0.02);
    if (mixer2) mixer2.update(0.02);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
