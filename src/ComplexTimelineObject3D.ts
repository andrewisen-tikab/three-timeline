import TimelineObject3D from './TimelineObject3D';

/**
 * A specific {@link THREE.Object3D} that has **complex** timeline features.
 * When changing the timeline, not only can the `transformation`, `rotation`, and `scale` be changed; but also the `geometry` and `material`.
 *
 * The `ComplexTimelineObject3D` allows you to change the children throughout the timeline.
 *
 * Use this class if you **don't** want to use extensions.
 */
export default class ComplexTimelineObject3D extends TimelineObject3D {
    readonly isComplexTimeline: boolean = true;

    constructor(date?: Date) {
        super(date);
    }
}
