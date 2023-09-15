# three-timeline

Adds an extra dimension, **time**, to regular `three.js` objects.

<img src="https://github.com/andrewisen-tikab/three-timeline/blob/dev/resources/example.gif?raw=true" width="100%" />

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

Now, update the object's position and update the timeline:

```ts
// Move the cube
cube.position.x = 100;

// Update the timeline at the current date
cube.updateTimeline(); // First timeline
```

Finally, set a new timeline date and update the object's position again:

```ts
// Set a new timeline date
const futureDate = new Date(now.getTime() + 1000);
cube.setTimelineDate(futureDate);

// Update the timeline at the new (!) date
cube.position.x = -5;
cube.updateTimeline(); // Second timeline
```

You will now have two timelines, `now` and `futureDate`.
The object will move from `x = 100` to `x = -5`.

It's you job to keep track of the timelines and update them accordingly.
The object will only store it's own timeline data.

## Example

See the `example` folder for a working example.
Or visit the GitHub Pages site:

[https://andrewisen-tikab.github.io/three-timeline/examples/examples/simple/](https://andrewisen-tikab.github.io/three-timeline/examples/examples/simple/)

[https://andrewisen-tikab.github.io/three-timeline/examples/examples/complex/](https://andrewisen-tikab.github.io/three-timeline/examples/examples/complex/)

[https://andrewisen-tikab.github.io/three-timeline/examples/examples/performance/](https://andrewisen-tikab.github.io/three-timeline/examples/examples/performance/)

## Docs

Auto-generated docs can be found here:

[https://andrewisen-tikab.github.io/three-timeline/docs/](https://andrewisen-tikab.github.io/three-timeline/docs/)

## Status

This is a work in progress. It's not ready for production use.

## Is this library right for you?

It depends on your use case. If you need to animate objects in a `three.js` scene, then this library is probably not for you. Instead, you should use the built-in `three.js` animation system.

But, if you want to represent object's over a set of specific points in time, or phases, then this library might be for you.

## License

MIT
