import './style.css'

import * as THREE from 'three';
 
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
 
let camera, scene, renderer, controls, stats;
 
let mesh;
 
const amount = 5;
const count = Math.pow( amount, 3 );
const matrix = new THREE.Matrix4();
const color = new THREE.Color();
const geometry = new THREE.IcosahedronGeometry( 0.05, 3 );
const material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
let myBallsBitch = [];
mesh = new THREE.InstancedMesh( geometry, material, count );

init();

function init() {
 
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100000 );
    camera.position.set( amount, amount, amount );
    scene = new THREE.Scene();
    const light = new THREE.HemisphereLight( 0xffffff, 0x888888, 3 );
    light.position.set( 0, 1, 0 );
    scene.add( light );
    let i = 0;

    const offset = ( amount - 1 ) / 2;
       
    for ( let x = 0; x < amount; x ++ ) {
 
        for ( let y = 0; y < amount; y ++ ) {
 
            for ( let z = 0; z < amount; z ++ ) {
 
              matrix.setPosition( offset - x, offset - y, offset - z );
              mesh.setColorAt( i, color.setHex( Math.random()* 0xffffff) );
              mesh.instanceColor.needsUpdate = true;
              mesh.setMatrixAt( i, matrix );
              let j = mesh.setMatrixAt( i, matrix );
              console.log(j);
              myBallsBitch.push(j);
              i ++;
            }
 
        }
 
    }
    //function boup() {

        
      
    //}
    //boup( )
    scene.add( mesh );
 
    console.log(mesh);
    
    const gui = new GUI();
    gui.add( mesh, 'count', 0, count );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );
 
    controls = new OrbitControls( camera, renderer.domElement );
 
    stats = new Stats();
    document.body.appendChild( stats.dom );
 
    window.addEventListener( 'resize', onWindowResize );
 
}


 
function onWindowResize() {
 
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
 
    renderer.setSize( window.innerWidth, window.innerHeight );
 
}
 
//get matrix
 
//
 
function animate() {
 
    controls.update();
 
    renderer.render( scene, camera );
 
    stats.update();
 
}
