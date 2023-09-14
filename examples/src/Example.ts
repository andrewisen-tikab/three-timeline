import * as THREE from 'three';
// @ts-ignore
import Stats from 'three/addons/libs/stats.module.js';
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// @ts-ignore
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import * as TIMELINE from '../../src';

export const GEOMETRY = /* @__PURE__ */ new THREE.BoxGeometry(1, 1, 1);
export const MATERIAL = /* @__PURE__ */ new THREE.MeshBasicMaterial({ color: 0x00ff00 });

THREE.ObjectLoader.prototype.parse = TIMELINE.parse;

THREE.Object3D.prototype.initTimeline = TIMELINE.initTimeline;
THREE.Object3D.prototype.setTimelineDate = TIMELINE.setTimelineDate;
THREE.Object3D.prototype.updateTimeline = TIMELINE.updateTimeline;
THREE.Object3D.prototype.toJSON = TIMELINE.toJSON;

export default class Example {
    public gui: GUI;

    public now: Date;
    public future1: Date;
    public future2: Date;
    public future3: Date;
    public future4: Date;

    public timelines: { now: Date; future1: Date; future2: Date; future3: Date; future4: Date };
    public loadingManger: THREE.LoadingManager;
    public loader: THREE.ObjectLoader;

    public cube: THREE.Mesh | null;

    public scene: THREE.Scene;
    public group: THREE.Group<THREE.Object3DEventMap>;
    public camera: THREE.PerspectiveCamera;
    public control: TransformControls;
    public renderer: THREE.WebGLRenderer;

    public params = {
        timeline: 'now',
        clear: () => {
            this.group.clear();
            this.control.detach();
        },
        toJSON: () => {
            if (this.cube == null) return;
            localStorage.setItem('three-timeline', JSON.stringify(this.cube.toJSON()));
        },
        fromJSON: () => {
            const json = localStorage.getItem('three-timeline');
            if (!json) return;
            this.params.clear();

            const data = JSON.parse(json);
            const object = this.loader.parse(data);

            // @ts-ignore
            object.setTimelineDate(this.timelines[this.params.timeline]);

            this.group.add(object);
            this.control.attach(object);

            this.cube = object as any;
        },
        logCube: () => {
            if (this.cube == null) return;
            console.log('cube', this.cube);
        },
        logCubeTimelineDate: () => {
            if (this.cube == null) return;
            console.log('timelineDate', this.cube.timelineDate);
        },
        logCubeTimeline: () => {
            if (this.cube == null) return;
            console.log('timeline', this.cube.timeline);
        },
        logCubeTimelinePositions: () => {
            if (this.cube == null) return;
            console.log(
                'timeline',
                this.cube.timeline.map((timelineObject) => timelineObject.position),
            );
        },
    };

    constructor() {
        // Setup debug
        this.gui = new GUI();

        const stats = new Stats();
        document.body.appendChild(stats.dom);

        // Setup timelines
        this.now = new Date();
        this.future1 = new Date(this.now.getTime() + 1000);
        this.future2 = new Date(this.now.getTime() + 2000);
        this.future3 = new Date(this.now.getTime() + 3000);
        this.future4 = new Date(this.now.getTime() + 4000);

        const { now, future1, future2, future3, future4 } = this;

        this.timelines = {
            now,
            future1,
            future2,
            future3,
            future4,
        };

        // Setup loaders
        this.loadingManger = new THREE.LoadingManager();
        this.loader = new THREE.ObjectLoader(this.loadingManger);

        // Setup reference to a single cube
        this.cube = null;

        // Setup scenes
        this.scene = new THREE.Scene();
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // Setup renderer
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Setup cube
        const cube = new THREE.Mesh(GEOMETRY, MATERIAL);
        this.cube = cube;
        this.group.add(cube);

        this.cube.initTimeline(now); // Init current timeline

        Object.values(this.timelines).forEach((date) => {
            cube.setTimelineDate(date); // Init future timelines
        });
        cube.setTimelineDate(this.timelines.now);

        // Setup controls
        this.control = new TransformControls(this.camera, this.renderer.domElement);
        this.scene.add(this.control);
        this.control.attach(cube);

        this.control.addEventListener('mouseUp', (_event: any) => {
            if (this.cube == null) return;
            this.cube.updateTimeline();
        });

        // Adjust camera

        this.camera.position.z = 5;

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

            const keys = Object.keys(this.timelines);
            const index = keys.indexOf(this.params.timeline);

            if (event.key === 'ArrowRight' && index < keys.length - 1)
                this.params.timeline = keys[index + 1];
            else if (event.key === 'ArrowLeft' && index > 0) this.params.timeline = keys[index - 1];

            this.handleChange(this.params.timeline);
        });

        // Setup render loop
        const animate = () => {
            requestAnimationFrame(animate);
            stats.update();
            this.renderer.render(this.scene, this.camera);
        };

        animate();

        // Setup GUI

        const timelineFolder = this.gui.addFolder('Timeline');
        timelineFolder
            .add(this.params, 'timeline', Object.keys(this.timelines))
            .onChange((value) => {
                this.handleChange(value);
            })
            .listen();

        const jsonFolder = this.gui.addFolder('JSON').close();
        jsonFolder.add(this.params, 'clear').name('Clear group');
        jsonFolder.add(this.params, 'toJSON').name('To JSON');
        jsonFolder.add(this.params, 'fromJSON').name('From JSON');

        const debugFolder = this.gui.addFolder('Debug').close();
        debugFolder.add(this.params, 'logCube').name('Log cube');
        debugFolder.add(this.params, 'logCubeTimelineDate').name('Log cube timeline date');
        debugFolder.add(this.params, 'logCubeTimeline').name('Log cube timeline');
        debugFolder
            .add(this.params, 'logCubeTimelinePositions')
            .name('Log cube timeline positions');
    }

    // Setup change events
    handleChange(value: string) {
        if (this.cube == null) return;
        console.log('Changed timeline to:', value);

        // Measure the time it takes to update the timeline
        const start = performance.now();

        // @ts-ignore
        this.cube.setTimelineDate(this.timelines[value]);

        const end = performance.now();
        console.log('Time to update timeline:', end - start);
    }
}
