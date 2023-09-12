# three-timeline

Adds an extra dimension, **time**, to regular `three.js` objects.

## Usage

First, setup everything:

```ts
// Import via ES6 modules
import * as THREE from 'three';
import * as TIMELINE from 'three-timeline';

// Add the extension functions
THREE.Object3D.prototype.initTimeline = TIMELINE.initTimeline;
THREE.Object3D.prototype.setTimelineDate = TIMELINE.setTimelineDate;
THREE.Object3D.prototype.updateTimeline = TIMELINE.updateTimeline;

// Add serialization extension functions (optional)
THREE.ObjectLoader.prototype.parse = TIMELINE.parse;
THREE.Object3D.prototype.toJSON = TIMELINE.toJSON;
```

Then create a `three.js` object and initialize the timeline:

```ts
// Generate an object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// Initialize timeline
const now = new Date();
cube.initTimeline(now);
```

Now, update the timeline and set a new date:

```ts
// Move the cube
cube.position.x = 100;

// Update the timeline at the current date
cube.updateTimeline(); // First timeline

// Set a new timeline date
const futureDate = new Date(now.getTime() + 1000);
cube.setTimelineDate(futureDate);

// Update the timeline at the new (!) date
cube.position.x = -5;
cube.updateTimeline(); // Second timeline
```

N.B: Each object holds its own timeline data.

## Example

See the `example` folder for a working example.
Or visit the GitHub Pages site:

[https://andrewisen-tikab.github.io/three-timeline/example/](https://andrewisen-tikab.github.io/three-timeline/example/)
