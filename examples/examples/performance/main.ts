import * as THREE from 'three';

import '../../styles.css';
import Example, { GEOMETRY, MATERIAL } from '../../src/Example';

const example = new Example();
const { control, cube, group, gui, timelines, params } = example;

const newHandleChange = () => {
    console.log('Changed timeline to:', params.timeline);

    // @ts-ignore
    const newTimeline = timelines[params.timeline];

    // Measure the time it takes to update the timeline
    const start = performance.now();

    for (let i = 0; i < group.children.length; i++) {
        const element = group.children[i];
        element.setTimelineDate(newTimeline);
    }

    const end = performance.now();
    console.log('Time to update timeline:', end - start);
};

example.handleChange = newHandleChange;

const randomPosition = (object: THREE.Object3D) => {
    object.position.x = Math.random() * 10 - 5;
    object.position.y = Math.random() * 10 - 5;
    object.position.z = Math.random() * 10 - 5;
    object.updateMatrix();
};

const performanceParams = {
    noOfCubes: 100,
    reinit: () => {
        if (cube) {
            control.detach();
            group.clear();
            example.cube = null;
        }

        for (let i = 0; i < performanceParams.noOfCubes; i++) {
            const cube = new THREE.Mesh(GEOMETRY, MATERIAL);

            cube.initTimeline();
            Object.values(timelines).forEach((date) => {
                randomPosition(cube);

                cube.setTimelineDate(date);
            });

            cube.setTimelineDate(timelines.now);

            group.add(cube);
        }
    },
};

const performanceFolder = gui.addFolder('Performance');
performanceFolder
    .add(performanceParams, 'noOfCubes')
    .name('Number of Cubes')
    .min(1)
    .max(1_000)
    .step(1);

performanceFolder.add(performanceParams, 'reinit').name('Reinit');

performanceParams.reinit();
