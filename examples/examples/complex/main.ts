import * as THREE from 'three';

import '../../styles.css';
import Example from '../../src/Example';
import { ComplexTimelineObject3D } from '../../../src';

const example = new Example();
const { gui, cube, control, group } = example;

if (cube) {
    control.detach();
    group.clear();
    example.cube = null;
}

const complexObject = new ComplexTimelineObject3D();
group.add(complexObject);
control.attach(complexObject);

const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const GEOMETRIES = {
    BOX: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material),
    CAPSULE: new THREE.Mesh(new THREE.CapsuleGeometry(1, 1, 4, 8), material),
    CONE: new THREE.Mesh(new THREE.ConeGeometry(1, 1, 8), material),
    TORUS: new THREE.Mesh(new THREE.TorusGeometry(10, 3, 16, 100), material),
} as const;

// const geometries = Object.keys(GEOMETRIES);

const randomPosition = (object: THREE.Object3D) => {
    object.position.x = Math.random() * 10 - 5;
    object.position.y = Math.random() * 10 - 5;
    object.position.z = Math.random() * 10 - 5;
    object.updateMatrix();
};

const complexParams = {
    addBox: () => {
        const object = GEOMETRIES.BOX.clone();
        randomPosition(object);
        complexObject.add(object);
    },
    addCapsule: () => {
        const object = GEOMETRIES.CAPSULE.clone();
        randomPosition(object);
        complexObject.add(object);
    },
    addCone: () => {
        const object = GEOMETRIES.CONE.clone();
        randomPosition(object);
        complexObject.add(object);
    },
    addTorus: () => {
        const object = GEOMETRIES.TORUS.clone();
        randomPosition(object);
        complexObject.add(object);
    },
    clearChildren: () => {
        complexObject.clear();
    },
};

complexObject.add(GEOMETRIES.BOX.clone());
const complexFolder = gui.addFolder('Complex');

complexFolder.add(complexParams, 'addBox').name('Add Box');
complexFolder.add(complexParams, 'addCapsule').name('Add Capsule');
complexFolder.add(complexParams, 'addCone').name('Add Cone');
complexFolder.add(complexParams, 'addTorus').name('Add Torus');
complexFolder.add(complexParams, 'clearChildren').name('=== Clear Children === ');
