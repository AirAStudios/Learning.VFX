//Three
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//Homemade
import { change_colour } from './js_functions.js'
import { active_toggle } from './js_functions.js';
import { combine } from './js_functions.js';
import { global_active } from './js_functions.js';
import { setGlobal_Active } from './js_functions.js';
import { global_hue } from './js_functions.js';
import { setGlobal_hue } from './js_functions.js';
import { active_toggle_mini } from './js_functions.js';

const canvas = document.getElementById('scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

var hydrogen = new Array(0x737373, 0xBFFF47)
var carbon = new Array(0x5C5C5C, 0XFFDB47)
var flourine = new Array(0x000000, 0xff4747)

const loader = new GLTFLoader();
function loadModel_CH4(model="", name="", path, position = {x:0, y:0, z:0}, scale = 1, rotation = {x:0, y:0, z:0}, electronegativity = 0) {
    loader.load(
        path, function(gltf) {
                model = gltf.scene;
                model.position.set(position.x, position.y, position.z);
                model.scale.set(scale, scale, scale);
                model.rotation.set(rotation.x, rotation.y, rotation.z);
                model.userData.baseRotation = model.rotation.clone();
                if (electronegativity == 0) {
                    scene.add(model);
                    document.getElementById("molecule_choice").addEventListener('change', function() {
                        if (document.getElementById("molecule_choice").value=="CH4") {
                            //Scene.children learned from ChatGPT prompt: Why doesn't (scene.model) {} check weather a model is in the scene three.js
                            if(!scene.children.includes(model)) {scene.add(model)}}
                        else {scene.remove(model)}
                    })
                }
                else {
                    //Set base opacity
                    var opacity = 0.75;
                    change_colour(model, opacity, hydrogen[0], carbon[0]);
                    //Create slider functionality
                    const slider = document.getElementById("opacity_slider")
                    //slider.oninput changed to slider.addEventListener: GPT prompt: What can cause document.getElementById("foo").oninput = function to not run
                    slider.addEventListener('input', function() {
                        //Change opacity based on value of slider
                        var progress = slider.value;
                        opacity = (progress)/100;
                        if (global_hue==1)
                        { 
                            change_colour(model, opacity, hydrogen[1], carbon[1]); 
                        }
                        else 
                        { 
                            change_colour(model, opacity, hydrogen[0], carbon[0]); 
                        }
                        //Change CSS properties and text based on slider
                        //Gradient technique learned from: https://www.youtube.com/watch?v=EYyWzE1DWuY
                        document.getElementById("slider_container").style.background = `linear-gradient(to right, #7045f5 ${progress}%, #ffffff ${progress}%)`;
                        if (progress < 40) { document.getElementById("slider_text_w").textContent = `Opacity:`; }
                        else { document.getElementById("slider_text_w").textContent = `Opacity: ${progress}%`; }
                        if (progress > 99) { document.getElementById("slider_text_p").textContent = `Opacity:`; }
                        else { document.getElementById("slider_text_p").textContent = `Opacity: ${progress}%`; }
                    })
                    //Create button to change colours 
                    //Initialise greyscale button
                    document.getElementById("toggle_btn3").classList.toggle('active'); 
                    document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                    //Create a toggle between greyscale and hue button when selecting hue button
                    active_toggle("toggle_btn2", "toggle_btn_tick_icon2", 
                        //Function for if it is active
                        function() {
                            //Pass in two functions in one slot
                            combine(
                                function() {
                                    // Rerender with hue colours
                                    change_colour(model, opacity, hydrogen[1], carbon[1])
                                }, function() { 
                                    //Toggle greyscale button
                                    document.getElementById("toggle_btn3").classList.toggle('active'); 
                                    document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                                })
                        }, function() {
                            combine(
                                function() {
                                    change_colour(model, opacity, hydrogen[0], carbon[0])
                                }, function() {
                                    document.getElementById("toggle_btn3").classList.toggle('active'); 
                                    document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                                })
                    }, 0, 1);
                    //Create a toggle between greyscale and hue button when selecting greyscale button
                    active_toggle("toggle_btn3", "toggle_btn_tick_icon3", 
                        function() {
                            combine(
                                function() {
                                    change_colour(model, opacity, hydrogen[0], carbon[0])
                                }, function() { 
                                    document.getElementById("toggle_btn2").classList.toggle('active'); 
                                    document.getElementById("toggle_btn_tick_icon2").classList.toggle('active')
                                })
                        }, function() {
                            combine(
                                function() {
                                    change_colour(model, opacity, hydrogen[1], carbon[1])
                                }, function() {
                                    document.getElementById("toggle_btn2").classList.toggle('active'); 
                                    document.getElementById("toggle_btn_tick_icon2").classList.toggle('active')
                                })
                    }, 0, 1);
                    
                    //Create show/hide button - removes and adds model with toggle
                    active_toggle("toggle_btn1", "toggle_btn_tick_icon1", 
                        function() {
                            if (document.getElementById("molecule_choice").value=="CH4")
                            {
                                scene.add(model)
                            }
                        }, function() {
                            scene.remove(model)
                        }, 1, 0);

                    //Check for different model selected
                    document.getElementById("molecule_choice").addEventListener('change', function() {
                        //Decide which checkbox to precheck
                        if (global_hue == 1)
                        {
                            document.getElementById("toggle_btn2").classList.toggle('active'); 
                            document.getElementById("toggle_btn_tick_icon2").classList.toggle('active')
                        }
                        else {
                            document.getElementById("toggle_btn3").classList.toggle('active'); 
                            document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                        }
                        //Check what molecule needs to be displayed
                        if (document.getElementById("molecule_choice").value=="CH4") {
                            //If CH4 needs to be diplayed, check if it already is, then add
                            if (!scene.children.includes(model) && global_active==1) {
                                scene.add(model)
                                opacity = (document.getElementById("opacity_slider").value)/100;
                                if (global_hue==1)
                                {
                                    change_colour(model, opacity, hydrogen[1], carbon[1]);
                                }
                                else {
                                    change_colour(model, opacity, hydrogen[0], carbon[0]);
                                }
                            }  
                        }
                        else {
                            //if it is active, remove
                            if (global_active==1) {
                                scene.remove(model)
                            }  
                        }
                    })
                
                }
        }, 
        undefined, 
        function ( error ) {
                console.error( error );
        }
    );
}
function loadModel_CH3F(model="", name="", path, position = {x:0, y:0, z:0}, scale = 1, rotation = {x:0, y:0, z:0}, electronegativity = 0, force = 0) {
    loader.load(
        path, function(gltf) {
                model = gltf.scene;
                model.position.set(position.x, position.y, position.z);
                model.scale.set(scale, scale, scale);
                model.rotation.set(rotation.x, rotation.y, rotation.z);
                model.userData.baseRotation = model.rotation.clone();
                if (electronegativity == 0) {
                    scene.add(model);
                    document.getElementById("molecule_choice").addEventListener('change', function() {
                        if (document.getElementById("molecule_choice").value!="CH4") {
                            //Scene.children learned from ChatGPT prompt: Why doesn't (scene.model) {} check weather a model is in the scene three.js
                            if(!scene.children.includes(model)) {
                                scene.add(model)
                            }
                        }
                        else {
                            scene.remove(model)
                        }
                    })
                }
                else {
                    //Check if model should be added straight away
                    var opacity = 0.75;
                    if (global_active == 1) {
                        scene.add(model);
                        opacity = document.getElementById("opacity_slider").value/100;
                        if (global_hue==1)
                        {
                            change_colour(model, opacity, hydrogen[1], carbon[1], flourine[1]);
                        }
                        else {
                            change_colour(model, opacity, hydrogen[0], carbon[0], flourine[0]);
                        }
                    }
                    else
                    {
                        change_colour(model, opacity, hydrogen[0], carbon[0], flourine[0]);
                    }
                    //Create slider
                    const slider = document.getElementById("opacity_slider")
                    slider.addEventListener('input', function() {
                        //Change opacity based on value of slider
                        var progress = slider.value;
                        opacity = (progress)/100;
                        if (global_hue==1)
                        { 
                            change_colour(model, opacity, hydrogen[1], carbon[1], flourine[1]); 
                        }
                        else 
                        { 
                            change_colour(model, opacity, hydrogen[0], carbon[0], flourine[0]); 
                        }
                    })
                    //Create button to change colours 
                    //Initialise greyscale button
                    document.getElementById("toggle_btn3").classList.toggle('active'); 
                    document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                    //Create a toggle between greyscale and hue button when selecting hue button
                    active_toggle_mini("toggle_btn2", 
                        //Function for if it is active
                        function() {
                            // Rerender with hue colours
                            change_colour(model, opacity, hydrogen[1], carbon[1], flourine[1])
                        },
                        function() {
                            change_colour(model, opacity, hydrogen[0], carbon[0], flourine[0])
                        }
                    );
                    //Create a toggle between greyscale and hue button when selecting greyscale button
                    active_toggle_mini("toggle_btn3", 
                        function() {
                            change_colour(model, opacity, hydrogen[0], carbon[0], flourine[0])
                        }, function() {
                            change_colour(model, opacity, hydrogen[1], carbon[1], flourine[1])
                    });
                    
                    //Create show/hide button - removes and adds model with toggle
                    active_toggle_mini("toggle_btn1", 
                        function() {
                            if (document.getElementById("molecule_choice").value!="CH4")
                            {
                                scene.add(model)
                            }
                        }, function() {
                            scene.remove(model)
                        });

                    //Check for different model selected
                    document.getElementById("molecule_choice").addEventListener('change', function() {
                        //Decide which checkbox to precheck
                        if (global_hue == 1)
                        {
                            document.getElementById("toggle_btn2").classList.toggle('active'); 
                            document.getElementById("toggle_btn_tick_icon2").classList.toggle('active')
                        }
                        else {
                            document.getElementById("toggle_btn3").classList.toggle('active'); 
                            document.getElementById("toggle_btn_tick_icon3").classList.toggle('active')
                        }
                        //Check what molecule needs to be displayed
                        if (document.getElementById("molecule_choice").value!="CH4") {
                            //If CH4 needs to be diplayed, check if it already is, then add
                            if (!scene.children.includes(model) && global_active==1) {
                                scene.add(model)
                                opacity = (document.getElementById("opacity_slider").value)/100;
                                if (global_hue==1)
                                {
                                    change_colour(model, opacity, hydrogen[1], carbon[1], flourine[1]);
                                }
                                else {
                                    change_colour(model, opacity, hydrogen[0], carbon[0], flourine[0]);
                                }
                            }  
                        }
                        else {
                            //if it is active, remove
                            if (global_active==1) {
                                scene.remove(model)
                            }   
                        }
                    })
                
                }
        }, 
        undefined, 
        function ( error ) {
                console.error( error );
        }
    );
}
loadModel_CH4('molecule', 'CH4', '/static/models/MethaneV1.glb');
loadModel_CH4('spheres', 'CH4', '/static/models/MethaneSpheresV8.glb', undefined, undefined, undefined, 1);
var done = 0;
document.getElementById("molecule_choice").addEventListener('change', function() {
    if (done==0) {
        loadModel_CH3F('molecule', 'CH3F', '/static/models/FlouromethaneV1.glb');
        loadModel_CH3F('spheres', 'CH3F','/static/models/Flouromethane_SpheresV3.glb', undefined, undefined, undefined, 1);
        done=1;
    }
})
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
