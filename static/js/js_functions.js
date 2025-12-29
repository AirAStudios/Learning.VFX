import * as THREE from 'three';

export var global_active = 0;
export function setGlobal_Active(a) {
  global_active = a;
}

export var global_hue = 0;
export function setGlobal_hue(h) {
    global_hue = h;
}
export function change_colour(model, opacity, hydrogen, carbon, flourine) {
    //Learned traversal operation from: https://waelyasmina.net/articles/searching-and-iterating-through-objects-in-three-js/#:~:text=To%20iterate%20through%20the%20entire,node)%20%7B%20if%20(node.
    model.traverse(function (node) {
        if (node.isMesh) {
            // getHexString learned from ChatGPT prompt: What is the method to get the hex value of an emission colour in three.js. getHex only returns an integer.
            //Check for Hydrogen
            if (node.material.emissive.getHexString() == "210000") {
                node.material.color.setHex(hydrogen);
                node.material.emissiveIntensity  = 0.01;
            }
            // Check for Carbon
            else if (node.material.emissive.getHexString() == "250000") {
                node.material.color.setHex(carbon);
                node.material.emissiveIntensity  = 0.01;
            }
            else if (node.material.emissive.getHexString() == "400000") {
                node.material.color.setHex(flourine);
                node.material.emissiveIntensity = 0.01;
            }
            // Other
            else if (node.material.emissive.getHexString() != "000000") {
                node.material.color.setHex(0xffffff);
            }
            if (opacity > 0.95) {
                node.material.transparent = false;
                node.material.opacity = 1;
                node.material.depthWrite = true;
                node.material.depthTest = true;
            }
            else {
                node.material.transparent = true;
                node.material.opacity = opacity;
                node.material.depthWrite = true;
                node.material.depthTest = false; 
            }
        }
    });
}

export function active_toggle(element_id, tick_element_id, function1, function2, global, hue) {
    const id = document.getElementById(element_id)
    const tick_id = document.getElementById(tick_element_id)
    id.addEventListener('click', function() {
        id.classList.toggle('active')
        tick_id.classList.toggle('active')
        if (id.classList.contains("active")) {
            function1();
            if (global == 1)
            {
                setGlobal_Active(1);
            }
            else if (hue == 1)
            {
                setGlobal_hue(1);
            } 
        }
        else {
            function2();
            if (global == 1)
            {
                setGlobal_Active(0);
            }
            else if (hue == 1)
            {
                setGlobal_hue(0);
            } 
        }
    })
}
export function active_toggle_mini(element_id, function1, function2) {
    const id = document.getElementById(element_id)
    id.addEventListener('click', function() {
        if (id.classList.contains("active")) {
            function1();
        }
        else {
            function2();
        }
    })
}

export function combine(function1, function2) {
    function1()
    function2()
}