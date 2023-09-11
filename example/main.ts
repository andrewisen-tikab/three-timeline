import './styles.css';

import * as THREE from 'three';
// @ts-ignore
import Stats from 'three/addons/libs/stats.module.js';
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// @ts-ignore
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import * as TIMELINE from '../src';

THREE.Object3D.prototype.initTimeline = TIMELINE.initTimeline;
THREE.Object3D.prototype.setTimelineDate = TIMELINE.setTimelineDate;
THREE.Object3D.prototype.updateTimeline = TIMELINE.updateTimeline;

const now = new Date();
const future1 = new Date(now.getTime() + 1_000);
const future2 = new Date(now.getTime() + 2_000);
const future3 = new Date(now.getTime() + 3_000);
const future4 = new Date(now.getTime() + 4_000);

const timelines = {
    now,
    future1,
    future2,
    future3,
    future4,
};

const params = {
    timeline: 'now',
};

const handleChange = (value: string) => {
    console.log('Changed timeline to:', value);

    // Measure the time it takes to update the timeline
    const start = performance.now();

    cube.setTimelineDate(timelines[value]);

    const end = performance.now();
    console.log('Time to update timeline:', end - start);
};

document.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    const keys = Object.keys(timelines);
    const index = keys.indexOf(params.timeline);

    if (event.key === 'ArrowRight' && index < keys.length - 1) params.timeline = keys[index + 1];
    else if (event.key === 'ArrowLeft' && index > 0) params.timeline = keys[index - 1];

    handleChange(params.timeline);
});

const gui = new GUI();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.initTimeline(now);
Object.values(timelines).forEach((date) => {
    cube.setTimelineDate(date);
});
cube.setTimelineDate(timelines.now);

const control = new TransformControls(camera, renderer.domElement);
scene.add(control);
control.attach(cube);
control.addEventListener('mouseUp', function (event) {
    cube.updateTimeline();
});

scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    stats.update();

    renderer.render(scene, camera);
}

animate();

gui.add(params, 'timeline', Object.keys(timelines))
    .onChange((value) => {
        handleChange(value);
    })
    .listen();
