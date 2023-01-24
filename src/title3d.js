
import * as THREE from 'three';

import { FontLoader } from  'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


import Stats from 'three/examples/jsm/libs/stats.module.js';


THREE.Cache.enabled = true;

let container, stats;

let camera, cameraTarget, scene, renderer;

let group, textMesh1, textMesh2, textGeo, materials;

let firstLetter = true;

let dice, dicexpos, dicescene, dicehit;

let text = 'Yatzee 3D',
  bevelEnabled = true,
  font = undefined,
  fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
  fontWeight = 'bold'; // normal bold

const height = 20,
  size = 40,
  hover = 10,
  curveSegments = 4,
  bevelThickness = 2,
  bevelSize = 1.5,
  winratio = 3;

const mirror = true;

const fontMap = {
  'helvetiker': 0,
  'optimer': 1,
  'gentilis': 2,
  'droid/droid_sans': 3,
  'droid/droid_serif': 4
};

const weightMap = {
  'regular': 0,
  'bold': 1
};

const reverseFontMap = [];
const reverseWeightMap = [];

for (const i in fontMap) reverseFontMap[fontMap[i]] = i;
for (const i in weightMap) reverseWeightMap[weightMap[i]] = i;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

let fontIndex = 1;

init();
animate();

function init() {

  container = document.getElementById('three3title');

  // CAMERA

  camera = new THREE.PerspectiveCamera(30, winratio, 1, 1500);
  camera.position.set(0, 60, 700);

  cameraTarget = new THREE.Vector3(0, 10, 0);

  // SCENE

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaFFaa);
  scene.fog = new THREE.Fog(0x111111, 250, 1400);

  // LIGHTS

  // const ambientLight = new THREE.AmbientLight('white', 5);
  // scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(0, 100, 100).normalize();
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);


  pointLight.color.setHSL(Math.random(), 1, 1);

  materials = [
    new THREE.MeshPhongMaterial({ color: 0x777777, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xaaaaaa }) // side
  ];

  group = new THREE.Group();
  group.position.y = 30;

  scene.add(group);

  loadFont();

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10000, 500),
    new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
  );

  plane.position.y = 30;
  plane.rotation.x = - Math.PI / 2;
  scene.add(plane);


  // Dice
  loadDice();


  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth / winratio);
  renderer.gammaOutput = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // STATS

  stats = new Stats();
  //container.appendChild( stats.dom );

  // EVENTS

  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  renderer.domElement.addEventListener('keypress', onDocumentKeyPress);
  renderer.domElement.addEventListener('keydown', onDocumentKeyDown);

  renderer.domElement.addEventListener('click', function () {

    pointLight.color.setHSL(Math.random(), 1, 0.5);



  });


  window.addEventListener('resize', onWindowResize);

}

function loadDice() {
  const gtlLoader = new GLTFLoader();

  dice = new THREE.Object3D();

  gtlLoader.load(
    '../objects/deglb.gltf',
    (object) => {
      // object.traverse(function (child) {
      //     if ((child as THREE.Mesh).isMesh) {
      //         // (child as THREE.Mesh).material = material
      //         if ((child as THREE.Mesh).material) {
      //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
      //         }
      //     }
      // })
      // object.scale.set(.01, .01, .01)
      dice = object.scene;

      //const boundingBox = new THREE.Box3().setFromObject(dice);

      dice.scale.x = 40;
      dice.scale.y = 40;
      dice.scale.z = 40;
      dice.position.x = 180;
      dice.position.z = -50;
      dice.position.y = 75;
      dice.rotation.x = 0.3;
      dice.rotation.y = 0.2;
      const de = dice.getObjectByName('de');
      dicexpos = 180;
      const targetMaterial = new THREE.MeshPhongMaterial();
      THREE.MeshBasicMaterial.prototype.copy.call(targetMaterial, de.material);

      de.material = targetMaterial;

      de.material.emissive = { isColor: true, r: 0.1, g: 0.1, b: 0.9 };
      de.material.transparent = true;
      de.material.opacity = 0.95;


      //scene.add(dice);
      group.add(dice);
      dicescene = group.getObjectByName('Scene');


      dicehit = 1;
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )
}


function animate(time) {

  targetRotation += 0.001;

  if (dicescene) {
    dicexpos = dicescene.position.x;

    if (dicehit == 1 && dicexpos < -180)
      dicehit = -1;

    if (dicehit == -1 && dicexpos > 180)
      dicehit = 1;


    dicexpos = dicexpos - 0.1 * dicehit;
  }

  requestAnimationFrame(animate);

  render();
  stats.update();

}

function render() {

  group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
  if (dicescene && dicexpos) {
    dicescene.position.x = dicexpos;
    dicescene.rotation.x += 0.01 * Math.random();
    dicescene.rotation.y += 0.005 * Math.random();
    dicescene.rotation.z += 0.002 * Math.random();

  }

  camera.lookAt(cameraTarget);
  //camera.lookAt(scene.position);

  renderer.clear();
  renderer.render(scene, camera);

}


function onWindowResize() {

  windowHalfX = window.innerWidth / 2;

  camera.aspect = 3;
  camera.updateProjectionMatrix();
  //camera.lookAt(scene.position);

  renderer.setSize(window.innerWidth, window.innerWidth / winratio);


}

//

function onDocumentKeyDown(event) {

  if (firstLetter) {

    firstLetter = false;
    text = '';

  }

  const keyCode = event.keyCode;

  // backspace

  if (keyCode == 8) {

    event.preventDefault();

    text = text.substring(0, text.length - 1);
    refreshText();

    return false;

  }

}

function onDocumentKeyPress(event) {

  const keyCode = event.which;

  // backspace

  if (keyCode == 8) {

    event.preventDefault();

  } else {

    const ch = String.fromCharCode(keyCode);
    text += ch;

    refreshText();

  }

}

function loadFont() {

  const loader = new FontLoader();
  // loader.load('fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
    loader.load('../fonts/gentilis_bold.typeface.json', function (response) {
    font = response;

    refreshText();

  });

}

function createText() {

  textGeo = new TextGeometry(text, {

    font: font,

    size: size,
    height: height,
    curveSegments: curveSegments,

    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled

  });

  textGeo.computeBoundingBox();

  const centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

  textMesh1 = new THREE.Mesh(textGeo, materials);

  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;

  group.add(textMesh1);

  if (mirror) {

    textMesh2 = new THREE.Mesh(textGeo, materials);

    textMesh2.position.x = centerOffset;
    textMesh2.position.y = - hover;
    textMesh2.position.z = height;

    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;

    group.add(textMesh2);

  }

}

function refreshText() {

  //updatePermalink();

  group.remove(textMesh1);
  if (mirror) group.remove(textMesh2);

  if (!text) return;

  createText();

}

function onPointerDown(event) {

  if (event.isPrimary === false) return;

  pointerXOnPointerDown = event.clientX - windowHalfX;
  targetRotationOnPointerDown = targetRotation;

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

}

function onPointerMove(event) {

  if (event.isPrimary === false) return;

  pointerX = event.clientX - windowHalfX;

  targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;

}

function onPointerUp(event) {

  if (event.isPrimary === false) return;

  renderer.domElement.removeEventListener('pointermove', onPointerMove);
  renderer.domElement.removeEventListener('pointerup', onPointerUp);

}

//
