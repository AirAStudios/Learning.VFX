import * as THREE from 'three';

export function change_colour(model, opacity, base, hydrogen, carbon) {
    //Learned traversal operation from: https://waelyasmina.net/articles/searching-and-iterating-through-objects-in-three-js/#:~:text=To%20iterate%20through%20the%20entire,node)%20%7B%20if%20(node.
    if (base == 1) {
        model.traverse(function (node) {
            if (node.isMesh) {
                node.material.color.setHex(0xffffff)
                //Learned method (material.opacity) from https://threejs.org/docs/#Material.opacity
                node.material.opacity = opacity;
                node.material.side = THREE.DoubleSide;
            }
        })
    }
    else {
        model.traverse(function (node) {
            if (node.isMesh) {
                // getHexString learned from ChatGPT
                //Check for Hydrogen
                if (node.material.emissive.getHexString() == "210000") {
                    node.material.color.setHex(hydrogen);
                }
                // Check for Carbon
                else if (node.material.emissive.getHexString() == "250000") {
                    node.material.color.setHex(carbon);
                }
                // Other
                else if (node.material.emissive.getHexString() != "000000") {
                    node.material.color.setHex(0xffffff);
                }
                node.material.opacity = opacity;
                node.material.side = THREE.DoubleSide;
            }
        });
    }
}

export function active_toggle(element_id, tick_element_id, function1, function2) {
    const id = document.getElementById(element_id)
    const tick_id = document.getElementById(tick_element_id)
    id.addEventListener('click', function() {
        id.classList.toggle('active')
        tick_id.classList.toggle('active')
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