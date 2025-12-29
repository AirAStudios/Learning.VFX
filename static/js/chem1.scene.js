//Three
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//Homemade
import { change_colour } from './js_functions.js'
import { active_toggle } from './js_functions.js';
import { combine } from './js_functions.js';

const canvas = document.getElementById('scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const loader = new GLTFLoader();
function loadModel(name="", path, position = {x:0, y:0, z:0}, scale = 1, rotation = {x:0, y:0, z:0}, electronegativity = 0) {
    loader.load(
        path, function(gltf) {
                name = gltf.scene;
                name.position.set(position.x, position.y, position.z);
                name.scale.set(scale, scale, scale);
                name.rotation.set(rotation.x, rotation.y, rotation.z);
                name.userData.baseRotation = name.rotation.clone();
                if (electronegativity == 0) {
                    scene.add(name);
                }
                else {
                    var opacity = 0.7;
                    document.getElementById("opacity_slider").addEventListener('pointerdown', function() {
                        opacity = (document.getElementById("opacity_slider").value)/100;
                        change_colour(name, opacity, 0, 0xFFDB47, 0xBFFF47);
                    })
                    document.getElementById("opacity_slider").addEventListener('pointerup', function() {
                        opacity = (document.getElementById("opacity_slider").value)/100;
                        change_colour(name, opacity, 0, 0xFFDB47, 0xBFFF47);
                    })
                    //Create button to change colours 
                    document.getElementById("toggle_btn3").classList.toggle('active'); 
                    document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                    active_toggle("toggle_btn2", "toggle_btn_tick_icon2", 
                        function() {
                            combine(
                                function() {
                                    change_colour(name, opacity, 0, 0xFFDB47, 0xBFFF47)
                                }, function() { 
                                    document.getElementById("toggle_btn3").classList.toggle('active'); 
                                    document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                                })
                        }, function() {
                            combine(
                                function() {
                                    change_colour(name, opacity, 0, 0x737373, 0x5C5C5C)
                                }, function() {
                                    document.getElementById("toggle_btn3").classList.toggle('active'); 
                                    document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                                })
                    });
                    active_toggle("toggle_btn3", "toggle_btn_tick_icon3", 
                        function() {
                            combine(
                                function() {
                                    change_colour(name, opacity, 0, 0x737373, 0x5C5C5C)
                                }, function() { 
                                    document.getElementById("toggle_btn2").classList.toggle('active'); 
                                    document.getElementById("toggle_btn_tick_icon2").classList.toggle('active')
                                })
                        }, function() {
                            combine(
                                function() {
                                    change_colour(name, opacity, 0, 0xFFDB47, 0xBFFF47)
                                }, function() {
                                    document.getElementById("toggle_btn2").classList.toggle('active'); 
                                    document.getElementById("toggle_btn_tick_icon2").classList.toggle('active')
                                })
                    });
                    
                    //Create show/hide button
                    active_toggle("toggle_btn1", "toggle_btn_tick_icon1", function() {scene.add(name)}, function() {scene.remove(name)});
                }
        }, 
        undefined, 
        function ( error ) {
                console.error( error );
        }
    );
}
loadModel('molecule', '/static/models/MethaneV1.glb');
loadModel('spheres', '/static/models/MethaneSpheresV8.glb', undefined, undefined, undefined, 1);

const planeGeo = new THREE.PlaneGeometry(50, 50)
const planeMat = new THREE.MeshStandardMaterial( {color: 0xff00ff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeo, planeMat );

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5,10,7);
scene.add(dirLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.1));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
