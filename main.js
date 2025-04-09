import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Rendering settings
const renderWidth = window.innerWidth;
const renderHeight = window.innerHeight;

// Variables for motion control
let controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Create root element
const rootElement = document.createElement('div');
rootElement.style.width = '100%';
rootElement.style.height = '100%';
document.body.appendChild(rootElement);

// Set up renderer
const renderer = new THREE.WebGLRenderer({
    antialias: false
});
renderer.setSize(renderWidth, renderHeight);
rootElement.appendChild(renderer.domElement);

// Create UI buttons for rotation and scaling
const createButton = (text, position, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.position = 'absolute';
    button.style.zIndex = '1000';
    button.style.padding = '10px 15px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.left = position.left;
    button.style.top = position.top;
    button.addEventListener('click', onClick);
    document.body.appendChild(button);
    return button;
};
// Alternative movement buttons for mobile or keyboard issues
// const moveForwardBtn = createButton('↑', { left: 'calc(100% - 120px)', top: '60px' }, () => {
//     velocity.z -= 1.0;
// });

// const moveBackwardBtn = createButton('↓', { left: 'calc(100% - 120px)', top: '110px' }, () => {
//     velocity.z += 1.0;
// });

// const moveLeftBtn = createButton('←', { left: 'calc(100% - 170px)', top: '110px' }, () => {
//     velocity.x -= 1.0;
// });

// const moveRightBtn = createButton('→', { left: 'calc(100% - 70px)', top: '110px' }, () => {
//     velocity.x += 1.0;
// });

// const jumpBtn = createButton('Jump', { left: 'calc(100% - 120px)', top: '10px' }, () => {
//     if (canJump === true) velocity.y += 20;
//     canJump = false;
// });

// Set up camera
const camera = new THREE.PerspectiveCamera(45, renderWidth / renderHeight, 0.1, 500); // Reduced field of view for a "smaller" camera effect
camera.position.copy(new THREE.Vector3().fromArray([-1, 1.5, 4])); // Adjusted position to make the camera appear smaller
camera.up = new THREE.Vector3(0, 1, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Set up scene
const scene = new THREE.Scene();

// Define available scenes
const scenes = {
    // local: './data/splat.ply',
    // local: '/Users/sebastiancavada/Documents/scsv/thesis/thesis_2025/mast3r_demo/data/2025-04-05_100917/exports/splat/splat.ply',
    // local: './data/2025-04-05_100917/exports/splat/splat.ply',
    main: 'https://huggingface.co/datasets/sebothetramp/Gaussian_Splat_MBZUAI/resolve/main/splat_scaled.ply',
    // full_campus: 'https://huggingface.co/datasets/sebothetramp/Gaussian_Splat_MBZUAI/resolve/main/full_splat_scaled.ply',
    entrance: 'https://huggingface.co/datasets/sebothetramp/Gaussian_Splat_MBZUAI/resolve/main/entrance_splat_scaled.ply',
    hydro: 'https://huggingface.co/datasets/sebothetramp/Gaussian_Splat_MBZUAI/resolve/main/hydro_splat_scaled.ply',
    nlp: 'https://huggingface.co/datasets/sebothetramp/Gaussian_Splat_MBZUAI/resolve/main/nlp_splat_scaled.ply',
};

// Function to generate scene buttons
function generateSceneButtons() {
    const container = document.getElementById('scene-buttons');
    container.innerHTML = ''; // Clear existing buttons
    
    Object.keys(scenes).forEach(sceneKey => {
        const button = document.createElement('button');
        button.className = 'scene-button';
        button.dataset.scene = sceneKey;
        // Capitalize first letter and replace underscores with spaces
        button.textContent = sceneKey.charAt(0).toUpperCase() + sceneKey.slice(1).replace(/_/g, ' ');
        
        button.addEventListener('click', (e) => {
            const sceneKey = e.target.dataset.scene;
            loadScene(sceneKey);
        });
        
        container.appendChild(button);
    });
}

let currentScene = 'main';

// Create a container for the splat scene to allow transformations
const splatContainer = new THREE.Group();
scene.add(splatContainer);

// Function to load a new scene
async function loadScene(sceneKey) {
    try {
        // Remove existing splat container from scene
        scene.remove(splatContainer);
        
        // Create a new container
        const newSplatContainer = new THREE.Group();
        scene.add(newSplatContainer);
        
        // Update the viewer's root node
        viewer.rootNode = newSplatContainer;
        
        // Load new scene
        await viewer.addSplatScene(scenes[sceneKey]);
        currentScene = sceneKey;
        
        // Update UI
        document.querySelectorAll('.scene-button').forEach(button => {
            button.classList.toggle('active', button.dataset.scene === sceneKey);
        });
        
        console.log(`Scene ${sceneKey} loaded successfully`);
    } catch (error) {
        console.error(`Error loading scene ${sceneKey}:`, error);
    }
}

// Set up viewer for Gaussian Splats
const viewer = new GaussianSplats3D.Viewer({
    'selfDrivenMode': false,
    'renderer': renderer,
    'camera': camera,
    'useBuiltInControls': false,
    'ignoreDevicePixelRatio': false,
    'gpuAcceleratedSort': true,
    'enableSIMDInSort': true,
    'sharedMemoryForWorkers': false,
    'integerBasedSort': true,
    'halfPrecisionCovariancesOnGPU': true,
    'dynamicScene': true, // Set to true to allow transformations
    'webXRMode': GaussianSplats3D.WebXRMode.None,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Instant,
    'antialiased': false,
    'focalAdjustment': 1.0,
    'logLevel': GaussianSplats3D.LogLevel.None,
    'sphericalHarmonicsDegree': 0,
    'enableOptionalEffects': false,
    'inMemoryCompressionLevel': 2,
    'freeIntermediateSplatData': false,
    'rootNode': splatContainer // Use our container as the root node
});

// Set up PointerLockControls
controls = new PointerLockControls(camera, document.body);

// Set up user interface for PointerLock
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

// Add global key event monitoring for diagnostics
document.addEventListener('keydown', function(e) {
    console.log('Global keydown event:', e.key, e.code, e.keyCode);
}, true);

instructions.addEventListener('click', function () {
    controls.lock();
});

controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
    // Hide UI buttons during pointer lock
    // moveForwardBtn.style.display = 'none';
    // moveBackwardBtn.style.display = 'none';
    // moveLeftBtn.style.display = 'none';
    // moveRightBtn.style.display = 'none';
    // jumpBtn.style.display = 'none';
});

controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
    // Show UI buttons when not in pointer lock
    // moveForwardBtn.style.display = 'block';
    // moveBackwardBtn.style.display = 'block';
    // moveLeftBtn.style.display = 'block';
    // moveRightBtn.style.display = 'block';
    // jumpBtn.style.display = 'block';
});

// Add key controls
const onKeyDown = function (event) {
    console.log('Key down:', event.code);  // Debug logging
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        // case 'Space':
        //     if (canJump === true) velocity.y += 20;
        //     canJump = false;
        //     break;
    }
};

const onKeyUp = function (event) {
    console.log('Key up:', event.code);  // Debug logging
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Alternative keyboard mapping for systems with key issues
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'd':
        case 'D':
            moveRight = true;
            console.log("D key pressed via alternative handler");
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'd':
        case 'D':
            moveRight = false;
            console.log("D key released via alternative handler");
            break;
    }
});

// Handle window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Generate scene buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    generateSceneButtons();
});

// Load initial scene
loadScene('main').then(() => {
    console.log('Initial scene loaded');
    requestAnimationFrame(update);
});

// Animation loop
function update() {
    requestAnimationFrame(update);
    
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    
    if (controls.isLocked === true) {
        // Apply physics
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 10.0 * delta; // gravity
        
        // Get movement direction
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // normalize for consistent speed in all directions
        
        // Apply movement
        if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;
        
        // Move the camera
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        
        camera.position.y += velocity.y * delta;
        
        // Floor constraint
        if (camera.position.y < 1.0) {
            velocity.y = 0;
            camera.position.y = 1.0;
            canJump = true;
        }
    }
    
    prevTime = time;
    
    // Update and render the viewer
    viewer.update();
    viewer.render();
}