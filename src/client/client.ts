//import * as fs from 'fs';
//const fs = require('fs')
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
//import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
//import * as path from 'path'
//import { Mesh } from 'three'
import {Mutex} from 'async-mutex'



const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

//var _geometry = new THREE.TorusGeometry(0.5)
var _geometry: any;



const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,    
    wireframe: true,
})
console.log("TEST0")
const gltfLoader = new GLTFLoader()
const mutex =  new Mutex()
const mutex2 = new Mutex()
//const release1 = await mutex2.acquire();
    //gltfLoader.load(path.join(__dirname, 'torus.gltf'), (gltf) => {
mutex2.acquire().then((release1)=>{
    gltfLoader.load('square.gltf', (gltf) => {
        console.log("TEST1")
        console.log(gltf)
        gltf.scene.traverse((child) => {
            child.traverse((mesh) => {            
                if (mesh instanceof THREE.Mesh)
                {
                    mutex.runExclusive(() => {
                        //if (undefined == _geometry)
    //                      _geometry = mesh.geometry
                    })
                    //mesh.geometry
                    console.log(mesh.geometry)
                    console.log(typeof mesh.geometry)
                    _geometry = mesh.geometry

                    //fs.writeFileSync("geometry.json", JSON.stringify(_geometry), "utf8")
                    //console.log("Data written successfully to disk")

                    //var pos_arr = _geometry.attributes.position.array
                    //console.log(pos_arr)
                    _geometry.attributes.position.array = new Float32Array([
                        -1,                        0,                        1,
                        1,                        0,                        1,
                        -1,                        0,                        -1,
                        1,                        0,                        -1,
                        2, 0, 0,
                        0,3,0,
                        0,0,4
                    ]);

                    _geometry.index.array = new Uint16Array([
                        0,1,3,
                        0,3,2,                        
                        4,5,6
                        // a combination of 3 indices in _geometry.attributes.position.array consist one triangle
                    ]);

                    release1()
                }
            })
            /*console.log("TEST2")
            console.log(JSON.stringify(child))
            console.log(child.type);
            if (child.type == "Mesh")
                console.log("object type is Mesh");
            _geometry = child.getObjectByName("geometries");
            console.log(_geometry)*/
        })    
    })    
})
//mutex2.acquire().then((release) => {
mutex2.waitForUnlock().then(()=>{  
    const cube = new THREE.Mesh(_geometry, material)
    scene.add(cube)
    
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }
    
    function animate() {
        requestAnimationFrame(animate)
    
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
    
        controls.update()
    
        render()
    }
    
    function render() {
        renderer.render(scene, camera)
    }
    animate()
})