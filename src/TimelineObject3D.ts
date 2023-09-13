import * as THREE from 'three';
import {
    AbstractTimelineObject3D,
    initTimeline,
    setTimelineDate,
    updateTimeline,
} from './extensions';

/**
 * A specific {@link THREE.Object3D} that has a timeline features.
 * Use this class if you **don't** want to use extensions.
 */
export default class TimelineObject3D extends THREE.Object3D implements AbstractTimelineObject3D {
    readonly hasTimeline: boolean;

    public initTimeline = initTimeline;

    public setTimelineDate = setTimelineDate;

    public updateTimeline = updateTimeline;

    /**
     * Create a new {@link TimelineObject3D} and initialize the timeline.
     * @param date The date of the timeline.
     */
    constructor(date?: Date) {
        super();
        this.hasTimeline = true;
        this.initTimeline(date);
    }
}
