# three-timeline

Adds an extra dimension, **time**, to regular `three.js` objects.

## Usage

```ts
// Import via ES6 modules
import * as THREE from 'three';
import * as TIMELINE from 'three-timeline';

// Add the extension functions
THREE.Object3D.prototype.initTimeline = TIMELINE.initTimeline;
THREE.Object3D.prototype.setTimelineDate = TIMELINE.setTimelineDate;
THREE.Object3D.prototype.updateTimeline = TIMELINE.updateTimeline;

// Generate an object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// Initialize timeline
const now = new Date();
cube.initTimeline(now);

// Update the timeline at the current date
cube.updateTimeline();

// Set a new timeline date
const futureDate = new Date(now.getTime() + 1000);
cube.setTimelineDate(futureDate);
```

This means that each object holds the timeline data.
