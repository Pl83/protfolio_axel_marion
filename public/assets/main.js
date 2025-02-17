
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';

const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';

const fillLight1 = new THREE.HemisphereLight( 0x8dc1de, 0x00668d, 1.5 );
fillLight1.position.set( 2, 1, 1 );
scene.add( fillLight1 );

const container = document.getElementById( 'container' );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild( renderer.domElement );

const videoOverlay = document.getElementById('video-overlay');
const overlayVideo = document.getElementById('overlay-video');
const closeVideoButton = document.getElementById('close-video');

//a sup
const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild( stats.domElement );


// Initialisation du raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Gestionnaire d'événements pour les clics
container.addEventListener('click', onPointerClick);

const GRAVITY = 30;

const STEPS_PER_FRAME = 5;

let windowHasFocus = true;

const worldOctree = new Octree();

const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let windowObjectReference;
let playerOnFloor = false;
let mouseTime = 0;

const keyStates = {};

const videoMappings = {
    Mac: './creationmobile/Mac.mp4', // Remplacez par les chemins de vos vidéos
    whellcometohell:'./creationmobile/whellcometohell.mp4',
    floatlandteaser:'./creationmobile/Floatlandtease.mp4',
};

function createVideoTexture(videoPath) {
    const video = document.createElement('video');
    video.id = 'video'; // ID pour identifier la vidéo
    video.preload = 'none'; // Optimisation : charge la vidéo au besoin
    video.src = videoPath; // Chemin de la vidéo
    video.loop = true; // Active la boucle
    video.muted = true; // Désactive le son pour éviter les restrictions
    video.playsInline = true; // Permet la lecture inline (spécialement pour mobile)

    // Gérer la lecture automatique
    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Lecture automatique démarrée.');
            })
            .catch((error) => {
                console.warn('Lecture automatique bloquée:', error);
                video.pause(); // Met en pause si la lecture automatique est bloquée
            });
    }

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    videoTexture.flipY = false;

    return videoTexture;
}


function infinitydot() {
      windowObjectReference = window.open("./infinitydot.html");
}

function musicdot() {
      windowObjectReference = window.open("./dotmusic.html");
}

function pandasuit() {
      windowObjectReference = window.open("https://viewer.pandasuite.com/tUPSxsOH");
}

function objmemoir() {
      windowObjectReference = window.open("Objet.html");
}


function onPointerClick(event) {
    // Calculer la position du pointeur dans le système de coordonnées normalisées (-1 à +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le raycaster avec la position du pointeur et la caméra
    raycaster.setFromCamera(pointer, camera);

    // Vérifier les intersections avec les objets de la scène
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;

        // Vérifier si cette mesh a un comportement associé
        if (clickedMesh.name === 'Mac') {
            infinitydot(); // Exemple : ouvrir un lien ou afficher une pop-up
        } else if (clickedMesh.name === 'floatland') {
            musicdot();
        } else if (clickedMesh.name === 'whellcometohell') {
            windowObjectReference = window.open('./anotherLink.html'); // Exemple
        } else {
            console.log(`Mesh cliquée : ${clickedMesh.name}`);
        }
    }
}

function createLights(scene) {
    const lightConfigs = [
        { color: 0xffffff, intensity: 50, position: [-10, 2, 0] },
        { color: 0xffffff, intensity: 50, position: [-20, 2, 0] },
        { color: 0xffffff, intensity: 50, position: [-30, 2, 0] },
        { color: 0xffffff, intensity: 50, position: [0, 2, 0] },
        { color: 0xffffff, intensity: 50, position: [-8, 2, -8] },
        { color: 0xffffff, intensity: 50, position: [-13, 2, 10] },
        { color: 0xffffff, intensity: 50, position: [-19, 2, -8] },
        { color: 0xffffff, intensity: 50, position: [-25, 2, 9] },
        { color: 0xffffff, intensity: 50, position: [-31, 2, -8] },
        { color: 0xffffff, intensity: 500, position: [-77, 20, 0] },

    ];

    lightConfigs.forEach(config => {
        const light = new THREE.PointLight(config.color, config.intensity, 0);
        light.position.set(...config.position);
        scene.add(light);
    });
}

document.addEventListener( 'keydown', ( event ) => {

    keyStates[ event.code ] = true;

} );

document.addEventListener( 'keyup', ( event ) => {

    keyStates[ event.code ] = false;

} );

container.addEventListener( 'mousedown', () => {

    document.body.requestPointerLock();

    mouseTime = performance.now();

} );

document.body.addEventListener( 'mousemove', ( event ) => {

    if ( document.pointerLockElement === document.body ) {

        camera.rotation.y -= event.movementX / 500;
        camera.rotation.x -= event.movementY / 500;

    }

} );

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function playerCollisions() {

    const result = worldOctree.capsuleIntersect( playerCollider );

    playerOnFloor = false;

    if ( result ) {

        playerOnFloor = result.normal.y > 0;

        if ( ! playerOnFloor ) {

            playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );

        }

        if ( result.depth >= 1e-10 ) {

            playerCollider.translate( result.normal.multiplyScalar( result.depth ) );

        }

    }

}

function updatePlayer( deltaTime ) {

    let damping = Math.exp( - 4 * deltaTime ) - 1;

    if ( ! playerOnFloor ) {

        playerVelocity.y -= GRAVITY * deltaTime;

        // small air resistance
        damping *= 0.1;

    }

    playerVelocity.addScaledVector( playerVelocity, damping );

    const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
    playerCollider.translate( deltaPosition );

    playerCollisions();

    camera.position.copy( playerCollider.end );

}

function getForwardVector() {

    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();

    return playerDirection;

}
    
function checkCameraPosition() {
    
    const { x, y, z } = camera.position;

    if (x >= -26 && x <= -24) {
        if (z >= 14 && z <= 15 ) {

        playerCollider.start.set( -25, 0.35, 13 );
        playerCollider.end.set( -25, 1, 13 );
        playerCollider.radius = 0.35;
        camera.position.copy( playerCollider.end );
        camera.rotation.set( 0, 0, 0 )
        playerVelocity.x = 0
        playerVelocity.y = 0
        playerVelocity.z = 0
        infinitydot()
            
        }
    }
    if (x >= -20 && x <= -19) {
        if (z >= 8 && z <= 10 ) {

            playerCollider.start.set( -21, 0.35, 9 );
            playerCollider.end.set( -21, 1, 9 );
            playerCollider.radius = 0.35;
            camera.position.copy( playerCollider.end );
            camera.rotation.set( 0, -(45+(45/2)), 0 )
            playerVelocity.x = 0
            playerVelocity.y = 0
            playerVelocity.z = 0
            musicdot()
                
        }
    }
    
    console.log( x +"x " +y+"y " +z+"z")

    if (x >= -31 && x <= -30) {
        if (z >= 8 && z <= 10 ) {

            playerCollider.start.set( -29, 0.35, 9 );
            playerCollider.end.set( -29, 1, 9 );
            playerCollider.radius = 0.35;
            camera.position.copy( playerCollider.end );
            camera.rotation.set( 0, (45+(45/2)), 0 )
            playerVelocity.x = 0
            playerVelocity.y = 0
            playerVelocity.z = 0
            pandasuit()
                
        }
    }

    if (x >= -26 && x <= -24) {
        if (z >= -10 && z <= -7 ) {

        playerCollider.start.set( -27, 0.35, -8 );
        playerCollider.end.set( -27, 1, -8 );
        playerCollider.radius = 0.35;
        camera.position.copy( playerCollider.end );
        camera.rotation.set( 0, -(45+(45/2)), 0 )
        playerVelocity.x = 0
        playerVelocity.y = 0
        playerVelocity.z = 0
        objmemoir()
            
        }
    }

}



function getSideVector() {

    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross( camera.up );

    return playerDirection;

}

function resetKeyStates() {
    for (const key in keyStates) {
        keyStates[key] = false;
    }
}

// Écouteurs pour détecter si la fenêtre est active ou non
window.addEventListener('blur', () => {
    windowHasFocus = false;
});

window.addEventListener('focus', () => {
    windowHasFocus = true;
    resetKeyStates(); // Réinitialise les touches lors du retour sur la fenêtre
});

// Modifiez vos contrôles pour vérifier si la fenêtre a le focus
function controls(deltaTime) {
    if (!windowHasFocus) return; // Si la fenêtre n'est pas active, ne pas traiter les contrôles

    // Donne un peu de contrôle dans les airs
    const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

    if (keyStates['KeyW']) {
        playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
    }

    if (keyStates['KeyS']) {
        playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
    }

    if (keyStates['KeyA']) {
        playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
    }

    if (keyStates['KeyD']) {
        playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
    }

    if (playerOnFloor) {
        if (keyStates['Space']) {
            playerVelocity.y = 10;
        }
    }
}

// Récupération des éléments HTML

// Ajout d'un gestionnaire d'événements au bouton de fermeture
closeVideoButton.addEventListener('click', () => {
    videoOverlay.style.display = 'none';
    overlayVideo.pause(); // Met en pause la vidéo quand l'écran est fermé
    overlayVideo.src = ''; // Réinitialise la source de la vidéo
});

// Gestionnaire d'événements pour les clics dans la scène
container.addEventListener('click', (event) => {
    // Calculer la position du pointeur dans le système de coordonnées normalisées
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le raycaster avec la position du pointeur et la caméra
    raycaster.setFromCamera(pointer, camera);

    // Vérifier les intersections avec les objets de la scène
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;

        // Vérifier si la mesh cliquée correspond à une vidéo
        if (clickedMesh.isMesh && videoMappings[clickedMesh.name]) {
            const videoPath = videoMappings[clickedMesh.name];
            
            // Afficher la vidéo dans le conteneur
            videoOverlay.style.display = 'flex';
            overlayVideo.src = videoPath;
            overlayVideo.play();
        }
    }
});

// Récupère l'élément de l'écran de chargement
const loadingScreen = document.getElementById('loading-screen');

// Charge le modèle GLB
const loader = new GLTFLoader().setPath('./');

loader.load('portfolio_collision.glb', (gltf) => {
    const collisionModel = gltf.scene;
    collisionModel.traverse((child) => {
        if (child.isMesh) {
            child.visible = false; // Rend les objets invisibles
        }
    });
    scene.add(collisionModel);
    worldOctree.fromGraphNode(collisionModel);
});

loader.load('portfolio.glb', (gltf) => {
    scene.add(gltf.scene);
    createLights(scene);
    // Traverse pour appliquer les textures vidéo
    gltf.scene.traverse((child) => {
        if (child.isMesh && videoMappings[child.name]) {
            const videoPath = videoMappings[child.name];
            child.material = new THREE.MeshBasicMaterial({ map: createVideoTexture(videoPath) });
        }
    });

    // Masque l'écran de chargement une fois le modèle chargé
    loadingScreen.style.display = 'none';
});
function teleportPlayerIfOob() {

    if ( camera.position.y <= - 5 ) {

        playerCollider.start.set( 0, 0.35, 0 );
        playerCollider.end.set( 0, 1, 0 );
        playerCollider.radius = 0.35;
        camera.position.copy( playerCollider.end );
        camera.rotation.set( 0, 0, 0 );

    }

}


function animate() {
    const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

    for (let i = 0; i < STEPS_PER_FRAME; i++) {
        controls(deltaTime);
        updatePlayer(deltaTime);
        teleportPlayerIfOob();
        checkCameraPosition();
    }

    renderer.render(scene, camera);

    //a sup
    stats.update();
}