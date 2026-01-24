//Learned from manual on threejs.org

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById('scene');
const scene = new THREE.Scene();
scene.background = null;

const width = window.innerWidth *4;
const height = window.innerHeight *4;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true});
renderer.setSize(width, height, false);

const models = [];
const loader = new GLTFLoader();
function loadModel(path, position = {x:0, y:0, z:0}, scale = 1, rotation = {x:0, y:0, z:0}) {
    loader.load(
        path, function(gltf) {
            const model = gltf.scene;
            model.position.set(position.x, position.y, position.z);
            model.scale.set(scale, scale, scale);
            model.rotation.set(rotation.x, rotation.y, rotation.z);
            model.userData.baseRotation = model.rotation.clone();
            scene.add(model);
            model.traverse(function(child) {
                if (child.isMesh) {
                    child.material.specularColor = new THREE.Color(0xffffff);
                    child.material.specularIntensity = 2.0;
                }
            });
            models.push(model);
        },
        undefined, 
        function ( error ) {
                console.error( error );
        }
    );
}
//Left
loadModel('static/models/blockV5.glb', {x: -3, y:1.2, z:2.1}, 0.12, {x:0.3, y:-0.05, z:-0.98});
loadModel('static/models/blockV5.glb', {x: -2.6, y:0.15, z:1.5}, 0.12, {x:-0.8, y:2.3, z:1.4});
loadModel('static/models/blockV5.glb', {x: -3.4, y:-0.6, z:2}, 0.12, {x:0.35, y:1.9, z:0.1});
loadModel('static/models/blockV5.glb', {x: -2, y:-1.5, z:1}, 0.12, {x:0.5, y:3.1, z:-0.05});
loadModel('static/models/blockV5.glb', {x: -2.3, y:-1.5, z:2.3}, 0.11, {x:1.6, y:0.05, z:-0.6});
//Right
loadModel('static/models/blockV5.glb', {x: 3, y:1.2, z:2.1}, 0.12, {x:-2.3, y:-1.5, z:-1.5});
loadModel('static/models/blockV5.glb', {x: 2.0, y:0.3, z:1.5}, 0.12, {x:-0.8, y:2.3, z:1.4});
loadModel('static/models/blockV5.glb', {x: 3.1, y:-0.6, z:2}, 0.12, {x:0.35, y:1.9, z:0.1});
loadModel('static/models/blockV5.glb', {x: 2, y:-1.3, z:1}, 0.12, {x:-0.8, y:-1, z:-0.05});
loadModel('static/models/blockV5.glb', {x: 2.3, y:-1.5, z:2.3}, 0.11, {x:1.6, y:0.05, z:-0.6});

const ambientLight = new THREE.AmbientLight(0x808080, 1);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
dirLight1.position.set(0,1.5,0);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 2.1);
dirLight2.position.set(-3.2,0.4,-0.5);
scene.add(dirLight2);

const dirLight5 = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight5.position.set(3.2,0.4,-0.5);
scene.add(dirLight5);

const dirLight3 = new THREE.DirectionalLight(0xffffff, 1);
dirLight3.position.set(0.2,-1.7,0.05);
scene.add(dirLight3);

const dirLight4 = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight4.position.set(0,0.1,2.4);
scene.add(dirLight4);

const mouse = { x:0, y:0 };
window.addEventListener('mousemove', function(event) {
    mouse.x = (event.clientX / window.innerWidth) *2 - 1;
    mouse.y = (event.clientY / window.innerHeight) *2 - 1;
});

const ROTATION_STRENGTH = 0.09;
const SMOOTHING = 0.05;

function animate() {
  requestAnimationFrame(animate);

  models.forEach(function(model) {
    //Learned from ChatGPT Prompt: The model's rotation: {x:90, y:0, z:0}. The model starts off spinning instead of just rotating slightly. models.forEach(model => { \n const targetRotationX = mouse.y * ROTATION_STRENGTH; \n const targetRotationY = mouse.x * ROTATION_STRENGTH; \n model.rotation.x += (targetRotationX - model.rotation.x) * 0.05; \n model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;});
    const base = model.userData.baseRotation;
    const targetX = base.x + mouse.y * ROTATION_STRENGTH;
    const targetY = base.y + mouse.x * ROTATION_STRENGTH;

    model.rotation.x += (targetX - model.rotation.x) * SMOOTHING;
    model.rotation.y += (targetY - model.rotation.y) * SMOOTHING;
  });
  const canvas = renderer.domElement;
  //From three.js responsive design
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.render(scene, camera);
}

animate();

renderer.domElement.style.pointerEvents = 'none';